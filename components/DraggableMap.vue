<template>
  <div>
    <b-row class="m-0">
      <b-col ref="mapcont" class="p-0">
        <client-only>
          <b-button variant="primary" size="lg" class="mb-2">
            <v-icon title="Find my location" name="map-marker-alt" />
            <span class="d-none d-sm-inline">&nbsp;Find my location</span>
          </b-button>
          <GmapMap
            ref="gmap"
            :center="{lat:53.9450, lng:-2.5209}"
            :zoom="zoom"
            :style="'width: ' + mapWidth + '; height: ' + mapWidth + 'px'"
            :options="{
              zoomControl: true,
              mapTypeControl: false,
              scaleControl: false,
              streetViewControl: false,
              rotateControl: false,
              fullscreenControl: true,
              disableDefaultUi: false,
              gestureHandling: 'greedy'
            }"
            @zoom_changed="zoomChanged"
            @bounds_changed="boundsChanged"
          >
            <GmapMarker
              :position="center"
              :clickable="false"
              :draggable="false"
              icon="/mapmarker.gif"
            />
          </GmapMap>
        </client-only>
      </b-col>
    </b-row>
  </div>
</template>
<style scoped>
</style>
<script>
// TODO Make find location button work - and in Postcode.vue.
// TODO DESIGN Make a bigger and more visible icon.
import { gmapApi } from 'vue2-google-maps'

export default {
  components: {},
  props: {
    initialZoom: {
      type: Number,
      required: false,
      default: 5
    }
  },
  data: function() {
    return {
      zoom: 5,
      bounds: null,
      center: null
    }
  },
  computed: {
    google: gmapApi,
    mapHeight() {
      const contWidth = this.$refs.mapcont ? this.$refs.mapcont.$el.width : 0

      return contWidth
    },
    mapWidth() {
      let height = Math.floor(window.innerHeight / 2)
      height = height < 200 ? 200 : height
      return height
    }
  },
  created() {
    this.zoom = this.initialZoom
  },
  async mounted() {},

  methods: {
    zoomChanged: function(zoom) {
      this.zoom = zoom
    },
    boundsChanged: function(bounds) {
      if (bounds) {
        this.bounds = {
          ne: {
            lat: bounds.getNorthEast().lat(),
            lng: bounds.getNorthEast().lng()
          },
          sw: {
            lat: bounds.getSouthWest().lat(),
            lng: bounds.getSouthWest().lng()
          }
        }

        this.center = this.$refs.gmap.$mapObject.getCenter()
      }
    },
    getCenter() {
      return this.center
    }
  }
}
</script>
