<template>
  <l-marker
    v-if="message.group.lat || message.group.lng"
    :key="'messagemarker-' + message.id + '-' + size"
    :lat-lng="[message.group.lat, message.group.lng]"
    :title="message.group.namedisplay"
    :icon="icon"
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

      return new L.DivIcon({
        html: re.outerHTML,
        iconAnchor: [150, 150],
        className: 'clear'
      })
    }
  },
  methods: {
    openIt(id) {
      window.open(process.env.USER_SITE + '/message/' + id)
    }
  }
}
</script>
