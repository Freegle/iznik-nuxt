<template>
  <l-marker
    v-if="message.group.lat || message.group.lng"
    :key="'messagemarker-' + message.id"
    :lat-lng="[message.group.lat, message.group.lng]"
    :title="message.group.namedisplay"
    :icon="icon"
    :z-index-offset="zIndex"
    @click="openIt(message.message.id)"
  />
</template>
<script>
import Vue from 'vue'
import L from 'leaflet'
import LiveMessage from './LiveMessage'

export default {
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  computed: {
    icon() {
      // Render the component off document.
      const Mine = Vue.extend(LiveMessage)
      let re = new Mine({
        propsData: {
          message: this.message
        }
      })
      re = re.$mount().$el

      console.log('Message', this.message)
      return new L.DivIcon({
        html: re.outerHTML,
        iconAnchor: [150, 150],
        className: 'clear'
      })
    },
    zIndex() {
      // Most recent on top.
      return new Date(this.message.message.arrival).getTime()
    }
  },
  methods: {
    openIt(id) {
      if (process.client) {
        window.open(process.env.USER_SITE + '/message/' + id)
      }
    }
  }
}
</script>
