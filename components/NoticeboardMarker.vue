<template>
  <l-marker :lat-lng="[noticeboard.lat, noticeboard.lng]" :interactive="false" :icon="icon" :title="noticeboard.id" />
</template>
<script>
import L from 'leaflet'

export default {
  props: {
    noticeboard: {
      type: Object,
      required: true
    }
  },
  computed: {
    icon() {
      return new L.Icon({
        iconUrl: '/mapmarker.gif'
      })
    }
  }
}
</script>
