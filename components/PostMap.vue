<template>
  <div ref="mapcont" class="w-100">
    <client-only>
      <vue-draggable-resizable
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
          @ready="ready"
          @zoomend="idle"
          @moveend="idle"
        >
          <l-tile-layer :url="osmtile" :attribution="attribution" />
          <div v-if="showMessages">
            <ClusterMarker v-if="messagesForMap.length" :markers="messagesForMap" :map="mapObject" :tag="['post', 'posts']" @click="idle" />
          </div>
          <div v-else>
            <GroupMarker v-for="g in groupsInBounds" :key="'marker-' + g.id + '-' + zoom" :group="g" :size="largeGroupMarkers ? 'rich' : 'poor'" />
          </div>
          <div v-if="mod && !mod">
            <!--            For mods, show the groups they're in to make it clearer why the map covers the area it does.-->
            <l-marker v-for="group in mygroups" :key="'groupmarker-' + group.id" :lat-lng="[group.lat, group.lng]" :icon="groupIcon">
              <l-tooltip>
                You're a member of {{ group.namedisplay }}.  This only shows for mods.
              </l-tooltip>
            </l-marker>
            <l-rectangle v-if="initialBounds" :bounds="initialBounds" :l-style="{ fillColor: 'grey', fillOpacity: 0.5}">
              <l-tooltip>
                This shaded area and the heart markers are only shown for mods, not members.
              </l-tooltip>
            </l-rectangle>
          </div>
        </l-map>
      </vue-draggable-resizable>
    </client-only>
  </div>
</template>
<script>
import VueDraggableResizable from 'vue-draggable-resizable/src/components/vue-draggable-resizable'
import cloneDeep from 'lodash.clonedeep'
import GroupMarker from './GroupMarker'
import map from '@/mixins/map.js'
import waitForRef from '@/mixins/waitForRef'
const ClusterMarker = () => import('./ClusterMarker')

let L = null

if (process.browser) {
  L = require('leaflet')
  require('leaflet-control-geocoder')
  require('leaflet-control-geocoder/dist/Control.Geocoder.css')
}

export default {
  components: {
    ClusterMarker,
    VueDraggableResizable,
    GroupMarker
  },
  mixins: [map, waitForRef],
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
    }
  },
  data: function() {
    return {
      context: null,
      messageLocations: [],
      mapObject: null,
      manyToShow: 20,
      shownMany: false,
      bump: 1,
      resizedHeight: null,
      lastBounds: null,
      zoom: 5
    }
  },
  computed: {
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
      const groups = this.allGroups
      const bounds = this.mapObject ? this.mapObject.getBounds() : null
      const ret = []

      if (!process.browser) {
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

          try {
            if (
              group.onmap &&
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

      const sorted = ret.sort((a, b) => {
        return a.namedisplay
          .toLowerCase()
          .localeCompare(b.namedisplay.toLowerCase())
      })

      return sorted
    },
    mygroups() {
      return this.$store.getters['auth/groups']
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
        const group = this.$store.getters['auth/groupById'](groupid)
        const bounds = new L.LatLngBounds([
          [group.bbox.swlat, group.bbox.swlng],
          [group.bbox.nelat, group.bbox.nelng]
        ]).pad(0.1)
        this.mapObject.flyToBounds(bounds)
      }
    },
    groupsInBounds(newval) {
      this.$emit('groups', this.groupsInBounds.map(g => g.id))
    }
  },
  mounted() {
    this.messageLocations = this.initialMessageLocations
  },
  methods: {
    ready() {
      this.waitForRef('map', () => {
        this.$emit('update:ready', true)
        this.mapObject = this.$refs.map.mapObject
        const self = this

        if (process.client) {
          L.Control.geocoder({
            placeholder: 'Search places...',
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
                // Empty out the query box so that the dropdown closes.
                this.setQuery('')

                // If we don't find anything at this location we will want to zoom out.
                self.shownMany = false

                self.$nextTick(() => {
                  // Move the map to the location we've found.
                  self.mapObject.flyToBounds(e.geocode.bbox)
                })
              }
            })
            .addTo(this.mapObject)

          this.mapObject.fitBounds(this.initialBounds)
        }
      })
    },
    idle() {
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

      // Get the messages from the server which are in the bounds of the map.
      const bounds = this.mapObject.getBounds()

      if (this.mapObject.getZoom() < this.minZoom) {
        // The parent may  replace us with something else at this point, e.g. with a group map.  But maybe not.
        // Their call.
        console.log('Min zoom at', this.mapObject.getZoom())
        this.$emit('minzoom', this.mapObject.getBounds())
      }

      const swlat = bounds.getSouthWest().lat
      const swlng = bounds.getSouthWest().lng
      const nelat = bounds.getNorthEast().lat
      const nelng = bounds.getNorthEast().lng
      let params = null

      if (!this.search) {
        // Get the messages in the map view.
        params = {
          subaction: 'inbounds',
          swlat: swlat,
          swlng: swlng,
          nelat: nelat,
          nelng: nelng
        }
      } else {
        // We are searching.  Get the list of messages from the server.
        params = {
          collection: 'Approved',
          subaction: 'searchmess',
          messagetype: this.type,
          search: this.search,
          groupid: this.groupid,
          swlat: swlat,
          swlng: swlng,
          nelat: nelat,
          nelng: nelng
        }
      }

      const ret = await this.$api.message.fetchMessages(params)

      if (ret.ret === 0 && ret.messages) {
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

        let countInBounds = 0

        messages.forEach(m => {
          if (
            swlat <= m.lat &&
            m.lat <= nelat &&
            swlng <= m.lng &&
            m.lng <= nelng
          ) {
            countInBounds++
          }
        })

        if (countInBounds >= this.manyToShow) {
          // We have seen lots, so we don't need to do the auto zoom out thing now.
          this.shownMany = true
        } else if (
          !this.search &&
          this.showMany &&
          countInBounds < this.manyToShow &&
          !this.shownMany
        ) {
          // If we haven't got more than 1 message at this zoom level, zoom out.  That means we'll always show at
          // least something.  This is useful when we search for a specific place.
          const currzoom = this.mapObject.getZoom()
          if (currzoom > this.minZoom) {
            this.mapObject.setZoom(currzoom - 1)
          } else {
            this.shownMany = true
          }
        }
      }

      this.messageLocations = messages
      this.$emit('messages', messages)
      this.$emit('update:loading', false)

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
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

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
</style>
