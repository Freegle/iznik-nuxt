<template>
  <div style="display: none;">
    <slot v-if="ready" />
  </div>
</template>

<script>
// From https://github.com/Platoniq/vue2-leaflet-heatmap, MIT license.  Issues with using via npm.

import L from 'leaflet'
import 'leaflet.heat'
import { findRealParent, propsBinder } from 'vue2-leaflet'

const props = {
  latLngs: {
    type: Array,
    default: () => [],
    custom: false
  },
  minOpacity: {
    type: Number,
    custom: true,
    default: 0.05
  },
  maxZoom: {
    type: Number,
    custom: true,
    default: 18
  },
  radius: {
    type: Number,
    custom: true,
    default: 25
  },
  blur: {
    type: Number,
    custom: true,
    default: 15
  },
  max: {
    type: Number,
    custom: true,
    default: 1.0
  },
  visible: {
    type: Boolean,
    custom: true,
    default: true
  },
  gradient: {
    type: Object,
    required: false,
    default: null
  }
}
export default {
  name: 'LHeatmap',
  props,
  data() {
    return {
      ready: false
    }
  },
  mounted() {
    const options = {}
    if (this.minOpacity) {
      options.minOpacity = this.minOpacity
    }
    if (this.maxZoom) {
      options.maxZoom = this.maxZoom
    }
    if (this.radius) {
      options.radius = this.radius
    }
    if (this.blur) {
      options.blur = this.blur
    }
    if (this.max) {
      options.max = this.max
    }
    if (this.gradient) {
      options.gradient = this.gradient
    }
    this.mapObject = L.heatLayer(this.latLngs, options)
    L.DomEvent.on(this.mapObject, this.$listeners)
    propsBinder(this, this.mapObject, props)
    this.ready = true
    this.parentContainer = findRealParent(this.$parent)
    this.parentContainer.addLayer(this, !this.visible)
  },
  beforeDestroy() {
    this.parentContainer.removeLayer(this)
  },
  methods: {
    setMinOpacity(newVal, oldVal) {
      this.mapObject.setOptions({ minOpacity: newVal })
    },
    setMaxZoom(newVal, oldVal) {
      this.mapObject.setOptions({ maxZoom: newVal })
    },
    setRadius(newVal, oldVal) {
      this.mapObject.setOptions({ radius: newVal })
    },
    setBlur(newVal, oldVal) {
      this.mapObject.setOptions({ blur: newVal })
    },
    setMax(newVal, oldVal) {
      this.mapObject.setOptions({ max: newVal })
    },
    setVisible(newVal, oldVal) {
      if (newVal === oldVal) return
      if (newVal) {
        this.parentContainer.addLayer(this)
      } else {
        this.parentContainer.removeLayer(this)
      }
    },
    addLatLng(value) {
      this.mapObject.addLatLng(value)
    }
  }
}
</script>

<style>
</style>
