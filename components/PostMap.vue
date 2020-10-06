<template>
  <div ref="mapcont" class="w-100">
    <client-only>
      <l-map
        ref="map"
        :center="center"
        :style="'width: 100%; height: ' + mapHeight + 'px'"
        :min-zoom="minZoom"
        :max-zoom="maxZoom"
        @ready="ready"
        @zoomend="idle"
        @moveend="idle"
      >
        <!--        :min-zoom="8"-->
        <l-tile-layer :url="osmtile" :attribution="attribution" />
        <div v-if="nonOverlappingMessages && nonOverlappingMessages.length && showCluster">
          <l-marker-cluster ref="cluster" :key="'cluster-' + nonOverlappingMessages.length" :options="{ showCoverageOnHover: false, disableClusteringAtZoom: zoomThumb, spiderfyOnMaxZoom: false, singleMarkerMode: true, zoomToBoundsOnClick: false }" @clusterclick="clusterClick">
            <PostMapMessage
              v-for="message in nonOverlappingMessages"
              :key="'message-' + message.id"
              :message="message"
              :map="mapObject"
              :bump="zoom"
            />
          </l-marker-cluster>
        </div>
      </l-map>
    </client-only>
  </div>
</template>
<script>
// Order of imports may be significant here because of problems with L.DisplayGrid in vue2-leaflet-markercluster
import L from 'leaflet'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
import 'leaflet-control-geocoder'
import 'leaflet-control-geocoder/dist/Control.Geocoder.css'
import PostMapMessage from './PostMapMessage'
import map from '@/mixins/map.js'
import waitForRef from '@/mixins/waitForRef'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

const ZOOM_PIN = 0
const ZOOM_THUMB = 16
const ZOOM_FULL = 17

export default {
  components: {
    PostMapMessage,
    'l-marker-cluster': Vue2LeafletMarkerCluster
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
      showCluster: false
    }
  },
  computed: {
    zoomFull() {
      return ZOOM_FULL
    },
    zoomThumb() {
      return ZOOM_THUMB
    },
    zoomPin() {
      return ZOOM_PIN
    },
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
    },
    nonOverlappingMessages() {
      // Ensure that messages don't exactly overlap.
      const ret = []
      const latlngs = []

      if (this.messageLocations) {
        this.messageLocations.forEach(message => {
          if (message.lat || message.lng) {
            let key = message.lat + '|' + message.lng

            while (latlngs[key]) {
              message.lat += 0.003
              message.lng += 0.003
              key = message.lat + '|' + message.lng
            }

            latlngs[key] = true
            ret.push(message)
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
    nonOverlappingMessages: {
      immediate: true,
      handler(newval) {
        this.$emit('messages', newval)
      }
    }
  },
  mounted() {
    this.messageLocations = this.initialMessageLocations
    console.log('Distance grid', L, L.DistanceGrid)
  },
  methods: {
    ready() {
      this.waitForRef('map', () => {
        const mapObject = this.mapObject
        const self = this

        this.mapObject.fitBounds(this.initialBounds)

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
            ]
          }),
          collapsed: false
        })
          .on('markgeocode', function(e) {
            if (e && e.geocode && e.geocode.bbox) {
              // Empty out the query box so that the dropdown closes.
              this.setQuery('')

              // Remove the clusters, to avoid weird leaflet errors.
              self.showCluster = false

              self.$nextTick(() => {
                // Move the map to the location we've found.
                mapObject.fitBounds(e.geocode.bbox)
              })
            }
          })
          .addTo(this.mapObject)
      })
    },
    async idle() {
      if (this.mapObject) {
        const bounds = this.mapObject.getBounds()
        this.showCluster = true

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

          console.log('Got messages', this.messageLocations)
          this.$nextTick(() => {
            if (this.$refs.cluster) {
              console.log('Refresh')
              this.$refs.cluster.mapObject.refreshClusters()
            } else {
              console.log('Show', L.DistanceGrid)
              this.showCluster = true
            }
          })

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
          if (countInBounds < 2) {
            const currzoom = this.mapObject.getZoom()
            if (currzoom > this.minZoom) {
              this.mapObject.setZoom(currzoom - 1)
            }
          }
        }
      }
    },
    clusterClick(a) {
      // We've clicked on the cluster.  zoomToBoundsOnClick is supposed to zoom to the bounds of this cluster, but
      // it often results in JS errors.  So don't use that, and carefully do our own thing here.
      if (a) {
        if (
          a.layer &&
          a.layer._bounds &&
          a.layer._bounds._northEast &&
          a.layer._bounds._southWest &&
          (a.layer._bounds._northEast.lat ||
            a.layer._bounds._northEast.lng ||
            a.layer._bounds._southWest.lat ||
            a.layer._bounds._southWest.lng)
        ) {
          this.showCluster = false
          this.$nextTick(() => {
            this.mapObject.flyToBounds(a.layer._bounds)
          })
        } else if (a.latlng && (a.latlng.lat || a.latlng.lng)) {
          // Don't trust the bounds.  Just centre and zoom in once, which isn't as good, but shows some
          // movement.
          this.showCluster = false
          this.$nextTick(() => {
            this.mapObject.flyTo(
              [a.latlng.lat, a.latlng.lng],
              this.mapObject.getZoom() + 1,
              {
                animate: true,
                duration: 0.5
              }
            )
          })
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

::v-deep .marker-cluster {
  box-shadow: 0 0rem 2rem $color-blue--2 !important;
}

::v-deep .marker-cluster-small {
  background-color: $color-green--darker;
}
::v-deep .marker-cluster-small div {
  background-color: white;
  color: black;
  font-weight: bold;
}

::v-deep .marker-cluster-medium {
  background-color: $color-blue--bright;
}
::v-deep .marker-cluster-medium div {
  background-color: white;
  color: black;
  font-weight: bold;
}

::v-deep .marker-cluster-large {
  background-color: $color-red;
}
::v-deep .marker-cluster-large div {
  background-color: white;
  color: black;
  font-weight: bold;
}

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
