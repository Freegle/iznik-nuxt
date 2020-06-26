// src/plugins/vue-leaflet.js
import Vue from 'vue'

import { LMap, LTileLayer, LMarker, LIcon, LPolygon } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'

const VueLeaflet = {
  install(Vue, options) {
    Vue.component('l-map', LMap)
    Vue.component('l-marker', LMarker)
    Vue.component('l-tile-layer', LTileLayer)
    Vue.component('l-icon', LIcon)
    Vue.component('l-polygon', LPolygon)
  }
}

Vue.use(VueLeaflet)

export default VueLeaflet
