<template>
  <div ref="mapcont" class="w-100">
    <client-only>
      <l-map
        ref="map"
        :style="'width: 100%; height: ' + mapHeight + 'px'"
        :min-zoom="minZoom"
        :max-zoom="maxZoom"
        @ready="ready"
        @zoomend="idle"
        @moveend="idle"
      >
        <l-tile-layer :url="osmtile" :attribution="attribution" />
        <ClusterMarker v-if="mapObject && messageLocations && messageLocations.length" :markers="messageLocations" :map="mapObject" />
      </l-map>
    </client-only>
  </div>
</template>
<script>
import L from 'leaflet'
import 'leaflet-control-geocoder'
import 'leaflet-control-geocoder/dist/Control.Geocoder.css'
import ClusterMarker from './ClusterMarker'
import map from '@/mixins/map.js'
import waitForRef from '@/mixins/waitForRef'

export default {
  components: {
    ClusterMarker
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
    }
  },
  data: function() {
    return {
      context: null,
      messageLocations: [],
      minZoom: 10,
      maxZoom: 15,
      mapObject: null,
      manyToShow: 20,
      shownMany: false
    }
  },
  computed: {
    mapHeight() {
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
    }
  },
  mounted() {
    this.messageLocations = this.initialMessageLocations
  },
  methods: {
    ready() {
      this.waitForRef('map', () => {
        this.mapObject = this.$refs.map.mapObject
        const self = this

        L.Control.geocoder({
          geocoder: L.Control.Geocoder.photon({
            geocodingQueryParams: {
              bbox: '-7.57216793459, 49.959999905, 1.68153079591, 58.6350001085'
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
                self.mapObject.fitBounds(e.geocode.bbox)
              })
            }
          })
          .addTo(this.mapObject)

        this.mapObject.fitBounds(this.initialBounds)
      })
    },
    async idle() {
      if (this.mapObject) {
        const bounds = this.mapObject.getBounds()

        this.$emit('centre', this.mapObject.getCenter())

        const swlat = bounds.getSouthWest().lat
        const swlng = bounds.getSouthWest().lng
        const nelat = bounds.getNorthEast().lat
        const nelng = bounds.getNorthEast().lng

        const ret = await this.$api.message.fetchMessages({
          subaction: 'inbounds',
          swlat: bounds.getSouthWest().lat,
          swlng: bounds.getSouthWest().lng,
          nelat: bounds.getNorthEast().lat,
          nelng: bounds.getNorthEast().lng
        })

        if (ret.ret === 0 && ret.messages) {
          this.messageLocations = ret.messages
          this.$emit('messages', ret.messages)

          let countInBounds = 0

          ret.messages.forEach(m => {
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
            }
          } else {
            this.shownMany = true
          }
        }
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
    height: calc(1.5em + 1rem + 2px);
    padding: 0.5rem 1rem;
    font-size: 1.25rem !important;
    line-height: 1.5;
    border-radius: 0.3rem;
  }
}
</style>
