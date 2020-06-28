// src/plugins/vue-leaflet.js
import Vue from 'vue'

import {
  LMap,
  LTileLayer,
  LMarker,
  LCircleMarker,
  LIcon,
  LPolygon,
  LGeoJson,
  LControl,
  LFeatureGroup
} from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'

const VueLeaflet = {
  install(Vue, options) {
    Vue.component('l-map', LMap)
    Vue.component('l-marker', LMarker)
    Vue.component('l-tile-layer', LTileLayer)
    Vue.component('l-icon', LIcon)
    Vue.component('l-polygon', LPolygon)
    Vue.component('l-geojson', LGeoJson)
    Vue.component('l-circle-marker', LCircleMarker)
    Vue.component('l-control', LControl)
    Vue.component('l-feature-group', LFeatureGroup)
  }
}

Vue.use(VueLeaflet)

export default VueLeaflet
