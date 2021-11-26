let L = null
let Wkt = null

if (process.browser) {
  L = require('leaflet')
  Wkt = require('wicket')
}

export default {
  computed: {
    isochroneBounds() {
      const isochrones = Object.values(this.$store.getters['isochrones/list'])
      let bounds = null

      if (L && isochrones && isochrones.length) {
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

        console.log('Layers', fg.getLayers())
        console.log('Layers length', fg.getLayers().length)

        if (fg.getLayers().length) {
          bounds = fg.getBounds().pad(0.1)
        }
      }

      console.log('Compute isochroneBounds', bounds)

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

      console.log('Compute isochroneBoundsArray', ret)
      return ret
    }
  }
}
