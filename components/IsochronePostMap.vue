<template>
  <div v-if="initialBounds">
    <div class="mb-1 border p-2 bg-white">
      <NoticeMessage v-if="everFetched && !primaryMessageList.length" variant="warning">
        There are no posts in this area at the moment.  You can check back later, or use the controls below:
        <ul>
          <li>The <em>Travel time</em> slider lets you see posts from further away.</li>
          <li>
            <!-- eslint-disable-next-line-->
            You can change your location in <nuxt-link to="/settings">Settings</nuxt-link>.
          </li>
          <li>The <em>Add location</em> link lets you show posts from another postcode.</li>
        </ul>
      </NoticeMessage>
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
              @update:bounds="boundsChange"
              @update:center="centreChange"
              @zoomend="boundsChange"
              @moveend="boundsChange"
            >
              <div class="leaflet-top leaflet-right d-flex flex-column justify-content-center">
                <b-btn v-if="canHide" variant="link" class="pauto black p-1" @click="hideMap">
                  <v-icon name="times-circle" title="Hide map" />
                </b-btn>
              </div>
              <l-tile-layer :url="osmtile" :attribution="attribution" />
              <div v-if="showMessages && mapObject">
                <div v-if="showIsochrones">
                  <ClusterMarker :markers="primaryMessageList" :map="mapObject" :tag="['post', 'posts']" @click="boundsChange" />
                  <ClusterMarker
                    :markers="secondaryMessageList"
                    :map="mapObject"
                    :tag="['post', 'posts']"
                    css-class="fadedMarker"
                    @click="boundsChange"
                  />
                </div>
                <ClusterMarker
                  v-else
                  :markers="primaryMessageList"
                  :map="mapObject"
                  :tag="['post', 'posts']"
                  @click="boundsChange"
                />
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
      everFetched: false,
      fetchedPrimaryMessages: [],
      fetchedSecondaryMessages: [],
      mapObject: null,
      manyToShow: 20,
      bump: 1,
      resizedHeight: null,
      lastBounds: null,
      zoom: 5,
      destroyed: false,
      mapboundsChangeCount: 0,
      initialCentre: null,
      showIsochrones: true,
      showInBounds: false
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
      // We're zoomed in far enough or we're forcing ourselves to show them.
      return this.zoom >= this.postZoom || this.forceMessages
    },
    groups() {
      const ret = []

      if (this.primaryMessageList) {
        this.primaryMessageList.forEach(m => {
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
      // Reference map boundsChange so that we recalc.
      const groups = this.mapboundsChangeCount ? this.allGroups : []
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
    groupIcon() {
      return new L.Icon({
        iconUrl: '/mapmarker.gif'
      })
    },
    homeIcon() {
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
          wkt.read(i.polygon)
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
    },
    primaryMessageList() {
      return this.fetchedPrimaryMessages.filter(m => {
        if (
          (!this.groupid || m.groupid === this.groupid) &&
          (this.type === 'All' || m.type === this.type)
        ) {
          return true
        }
      })
    },
    primaryMessageIds() {
      const ret = []

      this.primaryMessageList.forEach(m => {
        ret[m.id] = true
      })

      return ret
    },
    secondaryMessageList() {
      // Return anything relevant we have fetched which is not already in the primary one.
      return this.fetchedSecondaryMessages.filter(m => {
        if (
          !this.primaryMessageIds[m.id] &&
          (!this.groupid || m.groupid === this.groupid) &&
          (this.type === 'All' || m.type === this.type)
        ) {
          return true
        }
      })
    }
  },
  watch: {
    groups: {
      immediate: true,
      handler(newval) {
        if (!this.destroyed) {
          this.$emit('groups', newval)
        }
      }
    },
    type() {
      this.lastBounds = null

      if (this.zoom >= this.postZoom) {
        this.fetchMessages()
      }
    },
    search() {
      this.lastBounds = null
      this.fetchMessages()
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
      } else {
        this.$refs.map.mapObject.fitBounds(this.isochroneBounds)
      }
    },
    groupsInBounds(newval) {
      if (!this.destroyed) {
        this.$emit('groups', this.groupsInBounds.map(g => g.id))
      }
    },
    minutes() {
      this.$nextTick(this.fetchISOChrone)
    },
    transport() {
      this.$nextTick(this.fetchISOChrone)
    },
    isochrones() {
      this.$refs.map.mapObject.fitBounds(this.isochroneBounds)
      this.showIsochrones = true
      this.showInBounds = false
      this.initialCentre = null
    },
    primaryMessageList: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          if (!this.destroyed) {
            this.$emit('messages', newVal)
          }
        }
      }
    }
  },
  async mounted() {
    this.bounds = this.initialBounds

    if (this.mapHidden) {
      // Fetch the messages, since the ready event isn't going to fire.
      await this.fetchMessages()

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

          if (this.showMessages) {
            this.fetchMessages()
          }
        }
      })
    },
    centreChange(a, b) {
      if (!this.initialCentre) {
        // We get called once on map load, which doesn't count.
        this.initialCentre = this.mapObject.getCenter().toString()
      } else if (this.mapObject.getCenter().toString() !== this.initialCentre) {
        // We are panning, not just zooming.  We want to shift to showing all messages in the map bounds.
        this.showInBounds = true
        this.showIsochrones = false
      }
    },
    boundsChange() {
      this.mapboundsChangeCount++

      if (this.mapObject) {
        // We need to update the parent about our zoom level and whether we are showing the posts or groups.
        this.zoom = this.mapObject.getZoom()

        if (this.zoom < this.postZoom && !this.forceMessages) {
          this.$emit('update:showGroups', true)
        } else {
          this.$emit('update:showGroups', false)
        }

        if (this.showMessages) {
          this.fetchMessages()
        }

        this.$emit('update:bounds', this.mapObject.getBounds())
        this.$emit('update:zoom', this.mapObject.getZoom())
        this.$emit('update:centre', this.mapObject.getCenter())
      }
    },
    async fetchMessages() {
      this.$emit('update:loading', true)

      let params
      const bounds = this.mapObject
        ? this.mapObject.getBounds()
        : new L.LatLngBounds(this.initialBounds)

      if (this.search) {
        // We're searching.
        params = {
          collection: 'Approved',
          subaction: 'searchmess',
          messagetype: this.type,
          search: this.search,
          groupid: this.groupid,
          swlat: bounds.getSouthWest().lat,
          swlng: bounds.getSouthWest().lng,
          nelat: bounds.getNorthEast().lat,
          nelng: bounds.getNorthEast().lng
        }
      } else if (this.showIsochrones) {
        // The default view unless we've moved the map is the messages in the isochrone.
        params = {
          subaction: 'isochrones',
          groupid: this.groupid,
          search: this.search
        }
      } else if (this.showInBounds) {
        // If we've moved the map then we show the posts in the map bounds.
        params = {
          subaction: 'inbounds',
          swlat: bounds.getSouthWest().lat,
          swlng: bounds.getSouthWest().lng,
          nelat: bounds.getNorthEast().lat,
          nelng: bounds.getNorthEast().lng,
          groupid: this.groupid
        }
      }

      const ret = await this.$api.message.fetchMessages(params)
      this.fetchedPrimaryMessages =
        ret.ret === 0 && ret.messages ? ret.messages : []

      this.everFetched = true

      if (!this.destroyed) {
        if (!this.search && this.showIsochrones) {
          this.fetchSecondaryMessages()
        } else {
          this.secondaryMesageList = []
        }
      }

      this.$emit('update:loading', false)
    },
    async fetchSecondaryMessages() {
      if (!this.mapHidden) {
        // We're showing the isochrones.  But we also want to get the other messages, so that we can display those
        // faded on the map.  This allows them to see that there is activity in another area which they might
        // want to explore, without it being as prominent as the main activity we want to show.
        const bounds = this.mapObject.getBounds()
        const params = {
          subaction: 'inbounds',
          swlat: bounds.getSouthWest().lat,
          swlng: bounds.getSouthWest().lng,
          nelat: bounds.getNorthEast().lat,
          nelng: bounds.getNorthEast().lng
        }

        const ret = await this.$api.message.fetchMessages(params)

        this.fetchedSecondaryMessages =
          ret.ret === 0 && ret.messages ? ret.messages : []
      }
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
      this.showInBounds = false
      this.showIsochrones = true
      this.initialCentre = null
      this.mapObject.flyTo(new L.LatLng(this.me.lat, this.me.lng))

      setTimeout(() => {
        // Bit of a hack.  If we pan the map, then click home, we want to revert to showing the isochrone area.  But
        // the flyTo takes a while to complete.  So do that twice, to make it less likely that then zooming will
        // mess up.  I'm not sure how to fix this properly, but it's a rare case.
        this.initialCentre = null
      }, 2000)
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
  top: 0;
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

/deep/ .fadedMarker {
  filter: grayscale(100%);
  opacity: 0.5;
  z-index: -1 !important;

  .icon {
    border: 5px solid $color-gray--light;
  }
}
</style>
