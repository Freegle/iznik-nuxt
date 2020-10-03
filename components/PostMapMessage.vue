<template>
  <div v-if="message && (message.lat || message.lng)">
    <l-marker
      :key="'messagemarker-' + message.id"
      ref="marker"
      :lat-lng="[message.lat, message.lng]"
      :title="message.subject"
      :icon="icon"
      draggable
      @click="click"
    />
  </div>
</template>
<script>
import Vue from 'vue'
import waitForRef from '../mixins/waitForRef'
import PostMapMessageIcon from './PostMapMessageIcon'

let L = null

if (process.browser) {
  L = require('leaflet')
}

const ZOOM_FULL = 16

export default {
  mixins: [waitForRef],
  props: {
    message: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    bump: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      anchor: 16
    }
  },
  computed: {
    icon() {
      // Render the component off document.
      const Mine = Vue.extend(PostMapMessageIcon)

      let re = new Mine({
        propsData: {
          message: this.message,
          map: this.map,
          bump: this.bump,
          size: 'sm'
        }
      })

      re = re.$mount().$el

      return new L.DivIcon({
        html: re.outerHTML,
        iconSize: [this.anchor, this.anchor],
        className: 'clear'
      })
    }
  },
  methods: {
    click() {
      this.flyToPost()
    },
    flyToPost() {
      // this.map.flyTo(L.latLng(this.message.lat, this.message.lng), 14)
      this.map.setView([this.message.lat, this.message.lng], ZOOM_FULL, {
        animate: true,
        duration: 3
      })
    }
  }
}
</script>
