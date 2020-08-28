<template>
  <l-moving-marker
    v-if="currlat !== null"
    :key="'visualiseuser-' + id"
    :lat-lng="[currlat, currlng]"
    title="Freegler"
    :duration="2000"
    :icon="mapicon"
  />
</template>
<script>
import Vue from 'vue'
import L from 'leaflet'
import LMovingMarker from 'vue2-leaflet-movingmarker'
import ProfileImage from './ProfileImage'

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
      // Render the component off document.
      const Mine = Vue.extend(ProfileImage)
      let re = new Mine({
        propsData: {
          image: this.icon,
          border: true,
          size: 'lg',
          lazy: false
        }
      })

      re = re.$mount().$el

      return new L.DivIcon({
        html: re.outerHTML,
        className: 'clear jason'
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

<style>
.jason .ProfileImage__container .rounded-circle {
  animation-duration: 1s;
  animation-iteration-count: 2;

  animation-name: bounce-1;
  animation-timing-function: ease;
}

@keyframes bounce-1 {
  /*
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0);
  }
*/

  0% {
    transform: scale(1, 1) translateY(0);
    opacity: 0.2;
  }
  10% {
    transform: scale(1.1, 0.9) translateY(0);
  }
  30% {
    transform: scale(0.9, 1.1) translateY(-8px);
  }
  50% {
    transform: scale(1.05, 0.95) translateY(0);
    opacity: 0.7;
  }
  57% {
    transform: scale(1, 1) translateY(-5px);
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
    opacity: 1;
  }
}
</style>
