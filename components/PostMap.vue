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
          :min-zoom="minZoom - 1"
          :max-zoom="maxZoom"
          @ready="ready"
          @zoomend="idle"
          @moveend="idle"
        >
          <l-tile-layer :url="osmtile" :attribution="attribution" />
          <ClusterMarker v-if="mapObject && messageLocations && messageLocations.length" :markers="messageLocations" :map="mapObject" :tag="['post', 'posts']" />
        </l-map>
      </vue-draggable-resizable>
    </client-only>
  </div>
</template>
<script>
import VueDraggableResizable from 'vue-draggable-resizable/src/components/vue-draggable-resizable'
import cloneDeep from 'lodash.clonedeep'
import ClusterMarker from './ClusterMarker'
import map from '@/mixins/map.js'
import waitForRef from '@/mixins/waitForRef'
let L = null

if (process.browser) {
  L = require('leaflet')
  require('leaflet-control-geocoder')
  require('leaflet-control-geocoder/dist/Control.Geocoder.css')
}

export default {
  components: {
    ClusterMarker,
    VueDraggableResizable
  },
  mixins: [map, waitForRef],
  props: {
    initialBounds: {
      type: Object,
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
      default: 10
    },
    maxZoom: {
      type: Number,
      required: false,
      default: 15
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
      lastBounds: null
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
      this.getMessages()
    },
    async groupid(groupid) {
      this.lastBounds = null

      const messages = await this.getMessages()

      if (groupid) {
        // The messages we have just fetched may or may not match the bounds of the map.  Probably not.  So
        // work out new bounds and move the map.
        let bounds = new L.LatLngBounds()

        if (messages.length) {
          messages.forEach(m => {
            // eslint-disable-next-line new-cap
            bounds.extend(new L.LatLng(m.lat, m.lng))
          })
        } else {
          // No messages for this group.  Just position at the group centre and let the map zoom out until it
          // finds something.
          const group = this.$store.getters['group/get'](groupid)

          if (group) {
            bounds = [
              [group.lat - 0.01, group.lng - 0.01],
              [group.lat + 0.01, group.lng + 0.01]
            ]
          } else {
            // Shouldn't really get here.
            bounds = [
              [49.959999905, -7.57216793459],
              [58.6350001085, 1.68153079591]
            ]
          }
        }

        this.mapObject.flyToBounds(bounds)
      }
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
        const bounds = this.mapObject.getBounds().toBBoxString()

        if (bounds !== this.lastBounds) {
          this.lastBounds = bounds
          this.getMessages()
        }
      }
    },
    async getMessages() {
      const bounds = this.mapObject.getBounds()
      this.$emit('update:bounds', bounds)
      this.$emit('update:zoom', this.mapObject.getZoom())
      this.$emit('update:centre', this.mapObject.getCenter())

      if (this.mapObject.getZoom() < this.minZoom) {
        // The parent may  replace us with something else at this point, e.g. with a group map.  But maybe not.
        // Their call.
        this.$emit('minzoom')
      }

      const swlat = bounds.getSouthWest().lat
      const swlng = bounds.getSouthWest().lng
      const nelat = bounds.getNorthEast().lat
      const nelng = bounds.getNorthEast().lng

      // Get the messages.  If groupid is null then we will get the ones in the bounding box; otherwise we
      // will get all the ones on that group.
      const ret = await this.$api.message.fetchMessages({
        subaction: 'inbounds',
        swlat: bounds.getSouthWest().lat,
        swlng: bounds.getSouthWest().lng,
        nelat: bounds.getNorthEast().lat,
        nelng: bounds.getNorthEast().lng,
        groupid: this.groupid
      })

      let messages = []

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

        // If we haven't got more than 1 message at this zoom level, zoom out.  That means we'll always show at
        // least something.
        if (countInBounds < this.manyToShow && !this.shownMany) {
          const currzoom = this.mapObject.getZoom()
          if (currzoom > this.minZoom) {
            this.mapObject.setZoom(currzoom - 1)
          } else {
            this.shownMany = true
          }
        }

        this.messageLocations = messages
        this.$emit('messages', messages)

        return cloneDeep(messages)
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
