<template>
  <div>
    <b-row class="m-0">
      <b-col ref="mapcont" class="p-0">
        <client-only>
          <div class="d-flex justify-content-between">
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
            @ready="ready"
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
import map from '@/mixins/map.js'

let L = null

if (process.browser) {
  L = require('leaflet')
  require('leaflet-control-geocoder')
  require('leaflet-control-geocoder/dist/Control.Geocoder.css')
}

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
      mapObject: null
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
    ready() {
      this.waitForRef('map', () => {
        const self = this
        this.mapObject = this.$refs.map.mapObject

        if (process.client) {
          L.Control.geocoder({
            placeholder: 'Search for a place...',
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
        }
      })
    }
  }
}
</script>
