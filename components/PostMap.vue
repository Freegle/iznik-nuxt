<template>
  <div ref="mapcont" class="w-100">
    <client-only>
      <l-map
        ref="map"
        :center="center"
        :style="'width: 100%; height: ' + mapHeight + 'px'"
        :min-zoom="10"
        :max-zoom="15"
        @ready="ready"
        @zoomend="idle"
        @moveend="idle"
      >
        <!--        :min-zoom="8"-->
        <l-tile-layer :url="osmtile" :attribution="attribution" />
        <div v-if="nonOverlappingMessages">
          <l-marker-cluster ref="cluster" :options="{ showCoverageOnHover: false, disableClusteringAtZoom: zoomThumb, spiderfyOnMaxZoom: false, singleMarkerMode: true }">
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
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
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
      messageLocations: []
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
  },
  methods: {
    ready() {
      this.waitForRef('map', () => {
        this.mapObject.fitBounds(this.initialBounds)
      })
    },
    async idle() {
      if (this.mapObject) {
        const bounds = this.mapObject.getBounds()
        const ret = await this.$api.message.fetchMessages({
          subaction: 'inbounds',
          swlat: bounds.getSouthWest().lat,
          swlng: bounds.getSouthWest().lng,
          nelat: bounds.getNorthEast().lat,
          nelng: bounds.getNorthEast().lng
        })

        if (ret.ret === 0 && ret.messages) {
          this.messageLocations = ret.messages
          this.$nextTick(() => {
            if (this.$refs.cluster) {
              this.$refs.cluster.mapObject.refreshClusters()
            }
          })
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

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
</style>
