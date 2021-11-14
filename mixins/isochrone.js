let L = null
let Wkt = null

if (process.browser) {
  L = require('leaflet')
  Wkt = require('wicket')
}

export default {
  computed: {
    isochroneBounds() {
      const isochrones = this.$store.getters['isochrones/list']
      let bounds = null

      if (isochrones) {
        // eslint-disable-next-line new-cap
        const fg = new L.featureGroup()

        Object.values(isochrones).forEach(i => {
          try {
            const wkt = new Wkt.Wkt()
            wkt.read(i.polygon)
            const obj = wkt.toObject()
            fg.addLayer(obj)
          } catch (e) {
            console.log('WKT error', location, e)
          }
        })

        bounds = fg.getBounds().pad(0.1)
      }

      return bounds
    },
    isochroneBoundsArray() {
      let ret = null

      if (this.isochroneBounds) {
        ret = [
          [
            this.isochroneBounds.getSouthWest().lat,
            this.isochroneBounds.getSouthWest().lng
          ],
          [
            this.isochroneBounds.getNorthEast().lat,
            this.isochroneBounds.getNorthEast().lng
          ]
        ]
      }

      return ret
    }
  }
}
