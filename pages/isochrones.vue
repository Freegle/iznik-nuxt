<template>
  <div ref="mapcont" class="d-flex">
    <client-only>
      <l-map
        ref="map"
        :zoom="8"
        :center="center"
        :options="{ zoomControl: true, scrollWheelZoom: true, bounceAtZoomLimits: true}"
        :min-zoom="8"
        :max-zoom="15"
        class="map"
      >
        <l-tile-layer :url="osmtile" :attribution="attribution" />
        <l-geojson v-for="g in isochroneGEOJSONs" :key="'isochrone' + g.id" :geojson="g.json" :options="isochroneOptions(g)" @click="select(g)" />
        <l-geojson v-if="selected" :geojson="selected.json" :options="isochroneSelectedOptions" />
        <l-marker v-if="selected" :lat-lng="[selected.obj.lat, selected.obj.lng]" :interactive="false">
          <l-tooltip>
            Slider at {{ Math.round(100 * (selected.obj.minutes - 5) / 45) }}% by
            <span v-if="selected.obj.transport">
              {{ selected.obj.transport }}
            </span>
            <span v-else>
              default transport (drive)
            </span>
          </l-tooltip>
        </l-marker>
      </l-map>
    </client-only>
  </div>
</template>
<script>
import loginRequired from '@/mixins/loginRequired.js'
import map from '@/mixins/map.js'
// import { GestureHandling } from 'leaflet-gesture-handling'

// let L = null
let Wkt = null

if (process.client) {
  // L = require('leaflet')
  Wkt = require('wicket')
  // require('leaflet-control-geocoder')
  // require('leaflet-control-geocoder/dist/Control.Geocoder.css')
  // require('leaflet-gesture-handling/dist/leaflet-gesture-handling.css')
  // L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling)
}

export default {
  components: {},
  mixins: [loginRequired, map],
  data: function() {
    return {
      selected: null
    }
  },
  computed: {
    isochrones() {
      return this.$store.getters['isochrones/list']
    },
    isochroneGEOJSONs() {
      const ret = []

      Object.values(this.isochrones).forEach(i => {
        if (i.lat !== this.selectedLat || i.lng !== this.selectedLng) {
          const wkt = new Wkt.Wkt()
          try {
            wkt.read(i.polygon)
            ret.push({
              id: i.id,
              json: wkt.toJson(),
              obj: i
            })
          } catch (e) {
            console.log('WKT error', location, e)
          }
        }
      })

      return ret
    },
    isochroneSelectedOptions() {
      return {
        fillColor: 'darkblue',
        fill: true,
        fillOpacity: 0.2,
        color: 'darkgreen'
      }
    }
  },
  async mounted() {
    await this.$store.dispatch('isochrones/fetch', {
      all: true
    })
  },
  methods: {
    select(g) {
      this.selected = g
    },
    isochroneOptions(g) {
      let color = 'darkblue'

      if (g.obj.nickname) {
        color = 'red'
      } else if (g.obj.transport) {
        color = 'orange'
      } else if (g.obj.minutes !== 15) {
        console.log('Yellow', g)
        color = 'yellow'
      }

      return {
        fillColor: 'transparent',
        fill: true,
        fillOpacity: 0.2,
        color: color
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

.map {
  @include media-breakpoint-up(sm) {
    height: 300px;
  }

  @include media-breakpoint-up(lg) {
    height: calc(100vh - 150px);
  }
}
</style>
