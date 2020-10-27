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
  LFeatureGroup,
  LTooltip,
  LRectangle
} from 'vue2-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Without this, the default map marker doesn't appear in production.  Fairly well-known problem.
// eslint-disable-next-line
delete L.Icon.Default.prototype._getIconUrl
// eslint-disable-next-line
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

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
    Vue.component('l-tooltip', LTooltip)
    Vue.component('l-rectangle', LRectangle)
  }
}

Vue.use(VueLeaflet)

export default VueLeaflet
