<template>
  <l-map
    ref="map"
    :zoom="12"
    :max-zoom="maxZoom"
    :style="'width: 100%; height: ' + height + 'px'"
    :options="mapOptions"
    @ready="idle"
  >
    <l-tile-layer :url="osmtile" :attribution="attribution" />
    <l-marker v-if="home" :lat-lng="[home.lat, home.lng]" :interactive="false" :icon="homeicon" class="bg-none" />
    <l-marker :lat-lng="[position.lat, position.lng]" :interactive="false" :icon="blurmarker" />
    <l-geojson v-if="boundary" :geojson="boundaryJSON" :options="cgaOptions" />
  </l-map>
</template>
<script>
import Vue from 'vue'
import map from '@/mixins/map.js'
import { MAX_MAP_ZOOM } from '../utils/constants'
import HomeIcon from './HomeIcon'

const AREA_FILL_COLOUR = 'darkblue'
const CGA_BOUNDARY_COLOUR = 'darkblue'

let L = null
let Wkt = null

if (process.client) {
  Wkt = require('wicket')
  require('wicket/wicket-leaflet')
  L = require('leaflet')
  require('wicket/wicket-leaflet')
}

export default {
  mixins: [map],
  props: {
    home: {
      type: Object,
      required: false,
      default: null
    },
    position: {
      type: Object,
      required: true
    },
    locked: {
      type: Boolean,
      required: false,
      default: false
    },
    boundary: {
      type: String,
      required: false,
      default: null
    },
    maxZoom: {
      type: Number,
      required: false,
      default: MAX_MAP_ZOOM
    },
    height: {
      type: Number,
      required: false,
      default: 200
    }
  },
  computed: {
    mapOptions() {
      return {
        // On mobile require two-finger interaction.
        dragging: !this.locked && !L.Browser.mobile,
        touchZoom: !this.locked,
        scrollWheelZoom: false,
        bounceAtZoomLimits: true
      }
    },
    cgaOptions() {
      return {
        fillColor: AREA_FILL_COLOUR,
        fillOpacity: 0,
        color: CGA_BOUNDARY_COLOUR
      }
    },
    homeicon() {
      // Render the component off document.
      const Mine = Vue.extend(HomeIcon)
      let re = new Mine()

      re = re.$mount().$el

      return new L.DivIcon({
        html: re.outerHTML,
        className: 'bg-none'
      })
    },
    blurmarker() {
      const modtools = this.$store.getters['misc/get']('modtools')

      return new L.Icon({
        iconUrl: modtools ? '/bluering.png' : '/blurmarker.png',
        iconSize: [100, 100]
      })
    },
    boundaryJSON() {
      const wkt = new Wkt.Wkt()
      try {
        wkt.read(this.boundary)
        return wkt.toJson()
      } catch (e) {
        console.log('WKT error', this.boundary, e)
      }

      return null
    }
  },
  methods: {
    idle(themap) {
      if (this.home) {
        // We want to show both the centre and the marker.
        // eslint-disable-next-line new-cap
        const fg = new L.featureGroup([
          // eslint-disable-next-line new-cap
          new L.marker([this.position.lat, this.position.lng]),
          // eslint-disable-next-line new-cap
          new L.marker([this.home.lat, this.home.lng])
        ])

        themap.fitBounds(fg.getBounds().pad(0.1))
      } else {
        // eslint-disable-next-line new-cap
        const fg = new L.featureGroup([
          // eslint-disable-next-line new-cap
          new L.marker([this.position.lat, this.position.lng])
        ])

        themap.fitBounds(fg.getBounds().pad(0.1))
        themap.setZoom(MAX_MAP_ZOOM)
      }

      const zoomControl = this.$el.querySelector('.leaflet-top.leaflet-left')
      zoomControl.className = 'leaflet-top leaflet-right'
    }
  }
}
</script>
