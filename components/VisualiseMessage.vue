<template>
  <l-moving-marker
    v-if="currlat !== null"
    :key="'visualisemessage-' + id"
    :lat-lng="[currlat, currlng]"
    title="post"
    :duration="2000"
    :icon="mapicon"
  />
</template>
<script>
import L from 'leaflet'
import LMovingMarker from 'vue2-leaflet-movingmarker'

export default {
  components: { LMovingMarker },
  props: {
    id: {
      type: Number,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      currlat: null,
      currlng: null
    }
  },
  computed: {
    mapicon() {
      return L.icon({
        iconUrl: this.icon,
        iconSize: [100, 100],
        iconAnchor: [30, 110],
        className: 'border border-primary rounded'
      })
    }
  },
  mounted() {
    this.currlat = this.lat
    this.currlng = this.lng
  },
  methods: {
    setLatLng(lat, lng) {
      this.currlat = lat
      this.currlng = lng
    }
  }
}
</script>
