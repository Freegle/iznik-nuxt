<template>
  <div>
    <b-row class="m-0">
      <b-col ref="mapcont" class="p-0">
        <client-only>
          <b-button variant="primary" size="lg" class="mb-2" title="Find my location" @click="findLoc">
            <v-icon v-if="locating" name="sync" class="fa-spin" />
            <v-icon v-else-if="locationFailed" name="exclamation-triangle" />
            <v-icon v-else name="map-marker-alt" />
            &nbsp;Find my location
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
// TODO DESIGN Make a bigger and more visible icon.
// TODO EH Add place finder like in ExploreMap
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
      center: null,
      locating: false,
      locationFailed: false
    }
  },
  computed: {
    google: {
      get() {
        return process.browser ? gmapApi : []
      }
    },
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
    },
    findLoc() {
      try {
        if (
          navigator &&
          navigator.geolocation &&
          navigator.geolocation.getCurrentPosition
        ) {
          this.locating = true
          navigator.geolocation.getCurrentPosition(position => {
            this.center = new (this.google()).maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            )

            // Show close to where we think they are.
            this.zoom = 16
          })
        } else {
          console.log('Navigation not supported.  ')
          this.locationFailed = true
        }
      } catch (e) {
        console.error('Find location failed with', e)
        this.locationFailed = true
      }

      this.locating = false
    }
  }
}
</script>
