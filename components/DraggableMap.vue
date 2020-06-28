<template>
  <div>
    <b-row class="m-0">
      <b-col ref="mapcont" class="p-0">
        <client-only>
          <div class="d-flex justify-content-between">
            <!--            TODO MAPS AUTOCOMPLETE -->
            <!--            <gmap-autocomplete-->
            <!--              id="autocomplete"-->
            <!--              class="form-control form-control-lg"-->
            <!--              placeholder="Enter a location"-->
            <!--              :options="gb"-->
            <!--              size="lg"-->
            <!--              :types="['(cities)']"-->
            <!--              @place_changed="getAddressData"-->
            <!--            />-->
            <b-button variant="secondary" size="lg" class="mb-2 ml-2" title="Find my location" @click="findLoc">
              <v-icon v-if="locating" name="sync" class="fa-spin" />
              <v-icon v-else-if="locationFailed" name="exclamation-triangle" />
              <v-icon v-else name="map-marker-alt" />
              <span class="d-none d-sm-inline-block">&nbsp;Find my location</span>
            </b-button>
          </div>
          <l-map
            ref="map"
            :zoom="14"
            :center="center"
            :style="'width: ' + mapWidth + '; height: ' + mapWidth + 'px'"
            @update:bounds="boundsChanged"
          >
            <l-tile-layer :url="osmtile" :attribution="attribution" />
            <l-marker :lat-lng="center" :interactive="false" />
          </l-map>
        </client-only>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import L from 'leaflet'
import map from '@/mixins/map.js'

export default {
  components: {},
  mixins: [map],
  props: {
    initialZoom: {
      type: Number,
      required: false,
      default: 5
    }
  },
  data: function() {
    return {
      locating: false,
      locationFailed: false,
      // TODO MAPS AUTOCOMPLETE
      gb: {
        componentRestrictions: {
          country: ['gb']
        }
      }
    }
  },
  computed: {
    icon() {
      return new L.Icon({
        iconUrl: require('static/mapmarker.gif')
      })
    }
  },
  created() {
    this.zoom = this.initialZoom
  },
  methods: {
    getCenter() {
      return this.center
    },
    boundsChanged: function() {
      // Force centre to be recalculated
      this.bumpIt()
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
            // Show close to where we think they are.
            this.$refs.map.mapObject.flyTo(
              [position.coords.latitude, position.coords.longitude],
              16
            )

            // Force centre to be recalculated.
            this.bumpIt()
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
      // TODO MAPS AUTOCOMPLETE
      if (
        addressData &&
        addressData.geometry &&
        addressData.geometry.location
      ) {
        this.lat = addressData.geometry.location.lat()
        this.lng = addressData.geometry.location.lng()
        this.zoom = 16
      }
    }
  }
}
</script>
