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
        className: 'clear'
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
