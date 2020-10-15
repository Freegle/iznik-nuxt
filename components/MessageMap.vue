<template>
  <l-map
    ref="map"
    :zoom="16"
    :style="'width: 100%; height: 200px'"
    @ready="idle"
  >
    <l-tile-layer :url="osmtile" :attribution="attribution" />
    <l-marker v-if="centericon" :lat-lng="[centerat.lat, centerat.lng]" :interactive="false" :icon="homeicon" class="bg-none" />
    <l-marker :lat-lng="[position.lat, position.lng]" :interactive="false" />
  </l-map>
</template>
<script>
import Vue from 'vue'
import HomeIcon from './HomeIcon'
import map from '@/mixins/map.js'

let L = null

if (process.browser) {
  L = require('leaflet')
}

export default {
  mixins: [map],
  props: {
    centerat: {
      type: Object,
      required: true
    },
    position: {
      type: Object,
      required: true
    },
    centericon: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    homeicon() {
      // Render the component off document.
      const Mine = Vue.extend(HomeIcon)
      let re = new Mine()

      re = re.$mount().$el

      return new L.DivIcon({
        html: re.outerHTML,
        className: 'bg-none'
      })
    }
  },
  methods: {
    idle(map) {
      // We want to show both the centre and the marker.
      // eslint-disable-next-line new-cap
      const fg = new L.featureGroup([
        // eslint-disable-next-line new-cap
        new L.marker([this.position.lat, this.position.lng]),
        // eslint-disable-next-line new-cap
        new L.marker([this.centerat.lat, this.centerat.lng])
      ])

      map.fitBounds(fg.getBounds().pad(0.1))

      const zoomControl = this.$el.querySelector('.leaflet-top.leaflet-left')
      zoomControl.className = 'leaflet-top leaflet-right'
    }
  }
}
</script>
