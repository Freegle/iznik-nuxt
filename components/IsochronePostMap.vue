<template>
  <div v-if="initialBounds">
    <div className="d-flex flex-wrap bg-warning">
      <NoticeMessage variant="warning">
        <p>
          This is a test page to explore showing posts based on how long it
          would take to get there from a freegler's own location.
        </p>
        <p>
          <b>
            You should think about this from the point of view of a member - does it show a sensible area for someone in
            that place using that mode of transport?
          </b>
        </p>
        <p>
          The blue shaded map area shows is what decides which posts appear in the list below.  It's where we
          would also email posts from.  Analysis of a sample of users suggests they would see more posts, and closer
          posts, this way.
        </p>
        <p>
          You can experiment to see how far it would show for different types of transport and
          different travel times.
        </p>
      </NoticeMessage>
    </div>
    <div class="mb-1 border p-2 bg-white">
      <Isochrones />
      <div class="small">
        <!-- eslint-disable-next-line-->
        Show posts from <b-btn variant="link" size="sm" class="mb-1 p-0" @click="showPostsFromMyGroups">all my communities</b-btn>.
      </div>
    </div>
    <div v-if="mapHidden" class="d-flex justify-content-end">
      <b-btn variant="link" @click="showMap">
        Show map of posts
      </b-btn>
    </div>
    <div v-else>
      <div ref="mapcont" :style="mapHeight" class="w-100 position-relative mb-1">
        <div class="mapbox">
          <vue-draggable-resizable
            :class="{
              'd-none': mapHidden
            }"
            :h="mapHeight"
            w="auto"
            :handles="['bl', 'br']"
            :parent="false"
            :draggable="false"
            resizeable
            resize-axis="y"
            active
            prevent-deactivation
            @resizestop="onResize"
          >
            <l-map
              ref="map"
              :key="'map-' + bump"
              :style="'width: 100%; height: ' + mapHeight + 'px'"
              :min-zoom="minZoom"
              :max-zoom="maxZoom"
              :options="mapOptions"
              :bounds="bounds"
              @ready="ready"
              @update:bounds="idle"
              @zoomend="idle"
              @moveend="idle"
            >
              <div class="leaflet-top leaflet-right d-flex flex-column justify-content-center">
                <b-btn v-if="canHide" variant="link" class="pauto black p-1" @click="hideMap">
                  <v-icon name="times-circle" title="Hide map" />
                </b-btn>
              </div>
              <l-tile-layer :url="osmtile" :attribution="attribution" />
              <div v-if="showMessages">
                <ClusterMarker v-if="messagesForMap.length" :markers="messagesForMap" :map="mapObject" :tag="['post', 'posts']" @click="idle" />
                <l-marker v-if="me && me.settings && me.settings.mylocation" :lat-lng="[me.lat, me.lng]" :icon="homeIcon" @click="goHome">
                  <l-tooltip>
                    This is where your postcode is. You can change your postcode from Settings.
                  </l-tooltip>
                </l-marker>
              </div>
              <div v-else>
                <GroupMarker v-for="g in groupsInBounds" :key="'marker-' + g.id + '-' + zoom" :group="g" :size="largeGroupMarkers ? 'rich' : 'poor'" />
              </div>
              <l-geojson v-for="g in isochroneGEOJSONs" :key="'isochrone' + g.id" :geojson="g.json" :options="isochroneOptions" />
            </l-map>
          </vue-draggable-resizable>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VueDraggableResizable from 'vue-draggable-resizable/src/components/vue-draggable-resizable'
import cloneDeep from 'lodash.clonedeep'
import Vue from 'vue'
import map from '@/mixins/map.js'
import { GestureHandling } from 'leaflet-gesture-handling'
import Isochrones from '@/components/Isochrones'
import isochroneMixin from '@/mixins/isochrone'
import GroupMarker from './GroupMarker'
import BrowseHomeIcon from './BrowseHomeIcon'
const NoticeMessage = () => import('./NoticeMessage')
const ClusterMarker = () => import('./ClusterMarker')

let L = null
let Wkt = null

if (process.browser) {
  L = require('leaflet')
  Wkt = require('wicket')
  require('leaflet-control-geocoder')
  require('leaflet-control-geocoder/dist/Control.Geocoder.css')
  require('leaflet-gesture-handling/dist/leaflet-gesture-handling.css')
  L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling)
}

export default {
  components: {
    Isochrones,
    ClusterMarker,
    VueDraggableResizable,
    GroupMarker,
    NoticeMessage
  },
  mixins: [map, isochroneMixin],
  props: {
    initialBounds: {
      type: Array,
      required: true
    },
    heightFraction: {
      type: Number,
      required: false,
      default: 3
    },
    minZoom: {
      type: Number,
      required: false,
      default: 5
    },
    maxZoom: {
      type: Number,
      required: false,
      default: 15
    },
    postZoom: {
      type: Number,
      required: false,
      default: 10
    },
    forceMessages: {
      type: Boolean,
      required: false,
      default: false
    },
    groupid: {
      type: Number,
      required: false,
      default: null
    },
    type: {
      type: String,
      required: false,
      default: 'All'
    },
    search: {
      type: String,
      required: false,
      default: null
    },
    showMany: {
      type: Boolean,
      required: false,
      default: true
    },
    region: {
      type: String,
      required: false,
      default: null
    },
    canHide: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      context: null,
      messageLocations: [],
      mapObject: null,
      manyToShow: 20,
      bump: 1,
      resizedHeight: null,
      lastBounds: null,
      zoom: 5,
      destroyed: false,
      mapIdle: 0
    }
  },
  computed: {
    mapOptions() {
      return {
        zoomControl: true,
        dragging: !L.Browser.mobile,
        touchZoom: true,
        scrollWheelZoom: false,
        bounceAtZoomLimits: true,
        gestureHandling: true
      }
    },
    mapHidden() {
      return this.canHide && this.$store.getters['misc/get']('hidepostmap')
    },
    mapHeight() {
      if (this.resizedHeight !== null) {
        return this.resizedHeight
      }

      let height = 0

      if (process.browser) {
        height = window.innerHeight / this.heightFraction - 70
        height = height < 200 ? 200 : height
      }

      return height
    },
    showMessages() {
      // We're zoomed in far enough or we're forcing ourselves to show them (but not so that it's silly)
      console.log('Zoom', this.zoom, this.postZoom, this.forceMessages)
      return (
        this.zoom >= this.postZoom || (this.forceMessages && this.zoom >= 7)
      )
    },
    groups() {
      const ret = []

      if (this.messageLocations) {
        this.messageLocations.forEach(m => {
          if (ret.indexOf(m.groupid) === -1) {
            ret.push(m.groupid)
          }
        })
      }

      return ret
    },
    largeGroupMarkers() {
      // Can't get this to look sane.
      return false
    },
    allGroups() {
      return this.$store.getters['group/list']
    },
    groupsInBounds() {
      // Reference map idle so that we recalc.
      const groups = this.mapIdle ? this.allGroups : []
      const bounds = this.mapObject ? this.mapObject.getBounds() : null
      const ret = []

      if (!process.browser && bounds) {
        // SSR - return all for SEO.
        for (const ix in groups) {
          const group = groups[ix]

          if (
            group.onmap &&
            (!this.region ||
              group.region.trim().toLowerCase() ===
                this.region.trim().toLowerCase())
          ) {
            ret.push(group)
          }
        }
      } else if (bounds) {
        for (const ix in groups) {
          const group = groups[ix]

          if (group.lat || group.lng) {
            try {
              if (
                group.onmap &&
                group.publish &&
                bounds.contains([group.lat, group.lng]) &&
                (!this.region ||
                  this.region.toLowerCase() === group.region.toLowerCase())
              ) {
                ret.push(group)
              }
            } catch (e) {
              console.log('Problem group', e)
            }
          }
        }
      }

      const sorted = ret.sort((a, b) => {
        return a.namedisplay
          .toLowerCase()
          .localeCompare(b.namedisplay.toLowerCase())
      })

      return sorted
    },
    messagesForMap() {
      return this.mapObject &&
        this.messageLocations &&
        this.messageLocations.length
        ? this.messageLocations
        : []
    },
    groupIcon() {
      return new L.Icon({
        iconUrl: '/mapmarker.gif'
      })
    },
    homeIcon() {
      // Render the component off document.
      const Mine = Vue.extend(BrowseHomeIcon)
      let re = new Mine()

      re = re.$mount().$el

      return new L.DivIcon({
        html: re.outerHTML,
        className: 'bg-none top'
      })
    },
    isochrones() {
      return this.$store.getters['isochrones/list']
    },
    isochroneGEOJSONs() {
      const ret = []

      Object.values(this.isochrones).forEach(i => {
        const wkt = new Wkt.Wkt()
        try {
          // If this is a LINESTRING, it will not fill correctly because of how Leaflet handles those.  Convert to
          // a POLYGON instead.
          let str = i.polygon

          if (str.indexOf('LINESTRING') !== -1) {
            str = str.replace('LINESTRING', 'POLYGON(')
            str = str.replace(')', '))')
          }

          wkt.read(str)
          ret.push({
            id: i.id,
            json: wkt.toJson()
          })
        } catch (e) {
          console.log('WKT error', location, e)
        }
      })

      return ret
    },
    isochroneOptions() {
      return {
        fillColor: 'darkblue',
        fill: true,
        fillOpacity: 0.2,
        color: 'darkblue'
      }
    }
  },
  watch: {
    groups: {
      immediate: true,
      handler(newval) {
        this.$emit('groups', newval)
      }
    },
    type() {
      this.lastBounds = null

      if (this.zoom >= this.postZoom) {
        this.getMessages()
      }
    },
    search() {
      this.lastBounds = null
      this.getMessages()
    },
    groupid(groupid) {
      this.lastBounds = null

      if (groupid) {
        // Use the bounding box for the group.
        const group = this.myGroup(groupid)

        if (group.bbox) {
          const bounds = new L.LatLngBounds([
            [group.bbox.swlat, group.bbox.swlng],
            [group.bbox.nelat, group.bbox.nelng]
          ]).pad(0.1)
          this.mapObject.flyToBounds(bounds)
        }
      }
    },
    groupsInBounds(newval) {
      this.$emit('groups', this.groupsInBounds.map(g => g.id))
    },
    minutes() {
      this.$nextTick(this.fetchISOChrone)
    },
    transport() {
      this.$nextTick(this.fetchISOChrone)
    },
    isochrones() {
      this.$refs.map.mapObject.fitBounds(this.isochroneBounds)
    }
  },
  mounted() {
    // Initial ISOChrone fetch has been done by the parent or grandparent.

    this.bounds = this.initialBounds
    this.messageLocations = this.initialMessageLocations

    if (this.mapHidden) {
      // Say we're ready so the parent can crack on.
      this.$emit('update:ready', true)
    }
  },
  beforeDestroy() {
    this.destroyed = true
  },
  methods: {
    ready() {
      this.waitForRef('map', () => {
        this.$emit('update:ready', true)
        this.mapObject = this.$refs.map.mapObject
        const self = this

        if (process.client) {
          L.Control.geocoder({
            placeholder: 'Search for a place...',
            defaultMarkGeocode: false,
            geocoder: L.Control.Geocoder.photon({
              geocodingQueryParams: {
                bbox:
                  '-7.57216793459, 49.959999905, 1.68153079591, 58.6350001085'
              },
              nameProperties: [
                'name',
                'street',
                'suburb',
                'hamlet',
                'town',
                'city'
              ],
              serviceUrl:
                process.env.GEOCODE || 'https://geocode.ilovefreegle.org/api'
            }),
            collapsed: false
          })
            .on('markgeocode', function(e) {
              if (e && e.geocode && e.geocode.bbox) {
                // Searching unlocks the map
                self.$store.dispatch('misc/set', {
                  key: 'postmaparea',
                  value: null
                })

                // Empty out the query box so that the dropdown closes.
                this.setQuery('')

                self.$nextTick(() => {
                  // Move the map to the location we've found.
                  self.mapObject.flyToBounds(e.geocode.bbox)
                  self.$emit('searched')
                })
              }
            })
            .addTo(this.mapObject)
        }
      })
    },
    idle() {
      this.mapIdle++

      if (this.mapObject) {
        // We need to update the parent about our zoom level and whether we are showing the posts or groups.
        this.zoom = this.mapObject.getZoom()

        if (this.zoom < this.postZoom && !this.forceMessages) {
          this.$emit('update:showGroups', true)
        } else {
          this.$emit('update:showGroups', false)
        }

        const bounds = this.mapObject.getBounds().toBBoxString()

        if (bounds !== this.lastBounds) {
          if (this.lastBounds !== null) {
            // The map has now moved from the initial position.
            this.$emit('update:moved', true)
          }

          this.lastBounds = bounds

          if (this.showMessages) {
            this.getMessages()
          }
        }

        this.$emit('update:bounds', this.mapObject.getBounds())
        this.$emit('update:zoom', this.mapObject.getZoom())
        this.$emit('update:centre', this.mapObject.getCenter())
      }
    },
    async getMessages() {
      let messages = []
      this.$emit('update:loading', true)

      if (this.mapObject) {
        // Get the messages from the server which are in the user's isochrones.
        let params = null

        params = {
          subaction: 'isochrones',
          groupid: this.groupid,
          search: this.search
        }

        if (!this.search && !this.groupid) {
          // See if we have values cached.  We don't need to worry too much about the group and bounds because
          // it'll sort itself out if it's wrong.  We just want to get something up on the screen rapidly if we can.
          const cache = this.$store.getters['misc/get'](
            'cache.isochronespostmap'
          )

          if (cache) {
            try {
              messages = JSON.parse(cache)
              this.$emit('messages', messages)
              this.$emit('update:loading', false)
              console.log('Got cached messages')
            } catch (e) {
              console.log('Failed to parse cache, ignore')
            }
          }
        }

        const ret = await this.$api.message.fetchMessages(params)

        if (ret.ret === 0 && ret.messages && !this.destroyed) {
          // Don't really understand why the clone is necessary, but it is - without it we seem to process
          // old data inside the watch().
          messages = cloneDeep(ret.messages)

          if (this.groupid) {
            messages = messages.filter(m => {
              return m.groupid === this.groupid
            })
          }

          if (this.type !== 'All') {
            messages = messages.filter(m => {
              return m.type === this.type
            })
          }
        }

        this.messageLocations = messages
        this.$emit('messages', messages)
        this.$emit('update:loading', false)

        if (!this.search && !this.groupid) {
          // Update cache of messages.
          this.$store.dispatch('misc/set', {
            key: 'cache.isochronespostmap',
            value: JSON.stringify(messages)
          })
        }
      }

      return cloneDeep(messages)
    },
    onResize(x, y, width, height) {
      if (this.mapObject) {
        this.resizedHeight = height

        this.$nextTick(() => {
          this.mapObject.invalidateSize()

          // For some reason this doesn't always work immediately, so use a fallback too.
          setTimeout(() => {
            this.mapObject.invalidateSize()
          }, 1000)
        })
      }
    },
    goHome() {
      this.mapObject.flyTo(new L.LatLng(this.me.lat, this.me.lng))
    },
    hideMap() {
      this.$store.dispatch('misc/set', {
        key: 'hidepostmap',
        value: true
      })
    },
    showMap() {
      this.$store.dispatch('misc/set', {
        key: 'hidepostmap',
        value: false
      })
    },
    toJSON(bounds) {
      return [
        [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
        [bounds.getNorthEast().lat, bounds.getNorthEast().lng]
      ]
    },
    lockMap() {
      this.$store.dispatch('misc/set', {
        key: 'postmaparea',
        value: this.toJSON(this.mapObject.getBounds())
      })

      this.lockModal = true
      this.bump++
    },
    unlockMap() {
      this.$store.dispatch('misc/set', {
        key: 'postmaparea',
        value: null
      })

      this.unlockModal = true
      this.bump++
    },
    async fetchISOChrone() {
      await this.$store.dispatch('isochrones/fetch')
    },
    async showPostsFromMyGroups() {
      const settings = this.me.settings
      settings.browseView = 'mygroups'

      await this.$store.dispatch('auth/saveAndGet', {
        settings: settings
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.mapbox {
  width: 100%;
  top: 0px;
  left: 0;
  border: 1px solid $color-gray--light;
}

::v-deep .leaflet-control-geocoder {
  right: 30px;
}

@media screen and (max-width: 360px) {
  ::v-deep .leaflet-control-geocoder-form input {
    max-width: 200px;
  }
}

@include media-breakpoint-up(md) {
  ::v-deep .leaflet-control-geocoder-form input {
    height: calc(1.25em + 1rem + 2px);
    padding: 0.5rem 1rem;
    font-size: 1rem !important;
    line-height: 1.25;
    border-radius: 0.3rem;
  }
}

::v-deep .handle {
  content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAB3RJTUUH5AoLCyYQDowQNQAAAHRJREFUOMtjYBhMQJ6BgSGLgYHhP5TPzMDA4AXlG0DFuBkYGDKQ1KAAmGZ9KB+muY6BgUEYqjkaKuaAzYD/DAwM6mg212Cx2Z2QV5A1CxBjMwMWP9PXZuQwIMtmGDAj12ZkQJbNyJrJtpmBEpuRA9GBYcgBALMUJBS9QtP6AAAAAElFTkSuQmCC');
}

::v-deep .top {
  z-index: 1000 !important;
}

.pauto {
  pointer-events: auto;
}
</style>
