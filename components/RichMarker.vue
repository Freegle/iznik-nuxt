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
  data: function() {
    return {
      marker: null
    }
  },
  mounted() {
    this.createMarker()
  },
  methods: {
    createMarker() {
      let el = this.$parent

      while (el.$parent && !el.$mapPromise) {
        el = el.$parent
      }

      if (el.$mapPromise) {
        el.$mapPromise.then(map => {
          /* eslint-disable */
          this.marker = new RichMarker.RichMarker({
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
    },
    getMarker() {
      return this.marker
    }
  }
}
</script>
