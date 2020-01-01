<template>
  <div>
    <b-row class="m-0">
      <b-col ref="mapcont" class="p-0">
        <client-only>
          <div class="d-flex justify-content-between">
            <gmap-autocomplete
              id="autocomplete"
              class="form-control form-control-lg"
              placeholder="Enter a location"
              :options="gb"
              size="lg"
              :types="['(regions)']"
              @place_changed="getAddressData"
            />
            <b-button variant="primary" size="lg" class="mb-2 ml-2" title="Find my location" @click="findLoc">
              <v-icon v-if="locating" name="sync" class="fa-spin" />
              <v-icon v-else-if="locationFailed" name="exclamation-triangle" />
              <v-icon v-else name="map-marker-alt" />
              &nbsp;Find my location
            </b-button>
          </div>
          <GmapMap
            v-if="center"
            ref="gmap"
            :center="center"
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
<script>
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
      lat: 53.945,
      lng: -2.5209,
      locating: false,
      locationFailed: false,
      gb: {
        componentRestrictions: {
          country: ['gb']
        }
      }
    }
  },
  computed: {
    google: {
      get() {
        return process.browser ? gmapApi : []
      }
    },
    center() {
      const google = this.google()

      if (google) {
        return new google.maps.LatLng(this.lat, this.lng)
      }

      return null
    },
    mapHeight() {
      const contWidth = this.$refs.mapcont ? this.$refs.mapcont.$el.width : 0

      return contWidth
    },
    mapWidth() {
      let height = 0

      if (process.browser) {
        height = Math.floor(window.innerHeight / 2)
        height = height < 200 ? 200 : height
      }

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

        const center = this.$refs.gmap.$mapObject.getCenter()
        this.lat = center.lat()
        this.lng = center.lng()
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
            this.lat = position.coords.latitude
            this.lng = position.coords.longitude

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
    },

    getAddressData: function(addressData, placeResultData, id) {
      if (addressData) {
        this.lat = addressData.geometry.location.lat()
        this.lng = addressData.geometry.location.lng()
        this.zoom = 16
      }
    }
  }
}
</script>
