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
    <MessageModal v-if="showModal" ref="modal" :message="message" />
  </div>
</template>
<script>
import Vue from 'vue'
import waitForRef from '../mixins/waitForRef'
import PostMapMessageIcon from './PostMapMessageIcon'
const MessageModal = () => import('./MessageModal')

let L = null

if (process.browser) {
  L = require('leaflet')
}

const ZOOM_PIN = 0
const ZOOM_THUMB = 16
const ZOOM_FULL = 17

export default {
  components: { MessageModal },
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
      showModal: false
    }
  },
  computed: {
    size() {
      let size = 'sm'

      if (this.map.getZoom() >= ZOOM_FULL) {
        size = 'lg'
      } else if (this.map.getZoom() >= ZOOM_THUMB) {
        size = 'md'
      } else if (this.map.getZoom() >= ZOOM_PIN) {
        size = 'sm'
      }

      return size
    },
    anchor() {
      switch (this.size) {
        case 'md':
          return 100
        case 'lg':
          return 300
        default:
          return 16
      }
    },
    icon() {
      // Render the component off document.
      const Mine = Vue.extend(PostMapMessageIcon)

      let re = new Mine({
        propsData: {
          message: this.message,
          map: this.map,
          bump: this.bump,
          size: this.size
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
      if (this.size === 'sm' || this.size === 'md') {
        this.flyToPost()
      } else {
        this.showModal = true
        this.waitForRef('modal', () => {
          this.$refs.modal.show()
        })
      }
    },
    flyToPost() {
      // this.map.flyTo(L.latLng(this.message.lat, this.message.lng), 14)
      this.map.setView([this.message.lat, this.message.lng], 14, {
        animate: true,
        duration: 3
      })
    }
  }
}
</script>
