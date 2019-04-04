<template>
  <div>
    <div ref="flyaway">
      <!-- so named because it will fly away to another component -->
      <slot />
    </div>
  </div>
</template>
<script>
import RichMarker from 'googlemaps-rich-marker-web'

export default {
  props: {
    position: {
      type: Object,
      default: null
    }
  },
  mounted() {
    this.createMarker()
  },
  methods: {
    createMarker() {
      this.$parent.$parent.$mapPromise.then(map => {
        /* eslint-disable */
        new RichMarker.RichMarker({
          position: new window.google.maps.LatLng(
            this.position.lat,
            this.position.lng
          ),
          map: map,
          draggable: false,
          flat: true,
          anchor: RichMarker.RichMarkerPosition.TOP_LEFT,
          content: this.$refs.flyaway,
          // id: marker.id,
          // title: marker.name
        })
        /* eslint-enable */
      })
    }
  }
}
</script>
