<template>
  <div ref="mapcont" class="w-100">
    <client-only>
      <span style="z-index: 20000;">Zoom {{ zoomLevel }}</span>
      <l-map
        ref="map"
        :zoom="8"
        :center="center"
        :style="'width: 100%; height: ' + mapHeight + 'px'"
        :max-zoom="zoomFull"
        @ready="ready"
        @zoomend="idle"
      >
        <!--        :min-zoom="8"-->
        <l-tile-layer :url="osmtile" :attribution="attribution" />
        <div v-if="messages && mapobj">
          <l-marker-cluster ref="cluster" :options="{ showCoverageOnHover: false, disableClusteringAtZoom: zoomThumb, spiderfyOnMaxZoom: false, singleMarkerMode: true }">
            <PostMapMessage
              v-for="message in messagesInView"
              :key="'message-' + message.id"
              :message="message"
              :map="mapobj"
              :bump="bump"
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

let L = null

if (process.browser) {
  L = require('leaflet')
}

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
    messages: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      context: null,
      mapobj: null,
      bump: 1
    }
  },
  computed: {
    zoomLevel() {
      const zoom = this.mapobj ? this.mapobj.getZoom() : 0
      console.log('Zoom', zoom)
      return zoom
    },
    zoomFull() {
      return ZOOM_FULL
    },
    zoomThumb() {
      return ZOOM_THUMB
    },
    mapHeight() {
      let height = 0

      if (process.browser) {
        height = window.innerHeight - 70
        height = height < 200 ? 200 : height
      }

      return height
    },
    mapBounds() {
      return this.mapobj ? this.mapobj.getBounds() : null
    },
    messagesInView() {
      const ret = this.messages.filter(m => {
        return this.mapBounds.contains([m.lat, m.lng])
      })
      console.log('Messages in view', ret, this.mapBounds)
      return ret
    },
    messageBounds() {
      // Calculate the bounds which show all the messages
      if (!this.messages || !this.messages.length) {
        return null
      }

      const lats = []
      const lngs = []

      this.messages.forEach(m => {
        lats.push(m.lat)
        lngs.push(m.lng)
      })

      const minlat = Math.min.apply(null, lats) - 0.01
      const maxlat = Math.max.apply(null, lats) + 0.01
      const minlng = Math.min.apply(null, lngs) - 0.01
      const maxlng = Math.max.apply(null, lngs) + 0.01

      return L.latLngBounds(L.latLng(minlat, minlng), L.latLng(maxlat, maxlng))
    }
  },
  watch: {
    messageBounds: {
      immediate: true,
      handler(newval) {
        if (newval && this.mapobj) {
          this.mapobj.fitBounds(newval, 14)
        }
      }
    },
    zoomLevel() {
      if (this.$refs.cluster) {
        this.$refs.cluster.mapObject.refreshClusters()
      }
    }
  },
  mounted() {
    this.waitForRef('map', () => {
      this.mapobj = this.$refs.map.mapObject

      if (this.messageBounds) {
        this.mapobj.fitBounds(this.messageBounds, ZOOM_PIN)
      }
    })
  },
  methods: {
    ready() {
      if (this.messageBounds && this.mapobj) {
        this.mapobj.fitBounds(this.messageBounds, ZOOM_PIN)
      }

      this.boundsChanged()
    },
    idle() {
      // Bump will trigger icon re-render in case size has changed.
      this.bump++
      this.boundsChanged()
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.ourpopup {
  color: $colour-success;
  font-weight: bold;
}

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
