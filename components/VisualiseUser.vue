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
        className: 'clear map__user-icon'
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
.map__user-icon .ProfileImage__container img {
  animation-duration: 1s;
  animation-iteration-count: 1;

  animation-name: bounce-1;
  animation-timing-function: ease;
}

@keyframes bounce-1 {
  0% {
    transform: translateY(-40px);
    opacity: 0.1;
  }
  20% {
    transform: translateY(0);
    opacity: 0.3;
  }
  30% {
    transform: translateY(-25px);
  }
  40% {
    transform: translateY(0);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(0);
  }
  70% {
    transform: translateY(-6px);
  }
  80% {
    transform: translateY(0);
  }
  90% {
    transform: translateY(-3px);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
