<template>
  <l-map
    ref="map"
    :zoom="16"
    :center="[centerat.lat, centerat.lng]"
    :style="'width: 100%; height: 200px'"
    @ready="idle"
  >
    <l-tile-layer :url="osmtile" :attribution="attribution" />
    <l-marker :lat-lng="[position.lat, position.lng]" :interactive="false" />
  </l-map>
</template>
<script>
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
    }
  },
  methods: {
    idle(map) {
      // We want to centre the map but ensure we show the marker.  So use a fake position on the other side of the
      // center to get bounds.
      // eslint-disable-next-line new-cap
      const fg = new L.featureGroup([
        // eslint-disable-next-line new-cap
        new L.marker([this.position.lat, this.position.lng]),
        // eslint-disable-next-line new-cap
        new L.marker([
          this.centerat.lat - (this.position.lat - this.centerat.lat),
          this.centerat.lng - (this.position.lng - this.centerat.lng)
        ])
      ])
      map.fitBounds(fg.getBounds().pad(0.5))
    }
  }
}
</script>
