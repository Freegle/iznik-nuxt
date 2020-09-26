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
import LMovingMarker from 'vue2-leaflet-movingmarker'

let L = null

if (process.browser) {
  L = require('leaflet')
}

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
        className: 'border border-primary rounded item-image'
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

<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.item-image {
  animation-duration: 1s;
  animation-iteration-count: 1;

  animation-name: fadein-animation;
  animation-timing-function: ease;
}

@keyframes fadein-animation {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
