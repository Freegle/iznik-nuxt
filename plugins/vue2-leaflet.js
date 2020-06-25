// src/plugins/vue-leaflet.js
import Vue from 'vue'

import { LMap, LTileLayer, LMarker, LIcon } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'

const VueLeaflet = {
  install(Vue, options) {
    Vue.component('l-map', LMap)
    Vue.component('l-marker', LMarker)
    Vue.component('l-tile-layer', LTileLayer)
    Vue.component('l-icon', LIcon)
  }
}

Vue.use(VueLeaflet)

export default VueLeaflet
