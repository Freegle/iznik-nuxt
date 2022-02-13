let L = null
let Wkt = null

if (process.browser) {
  L = require('leaflet')
  Wkt = require('wicket')
}

export default {
  computed: {
    isochroneBounds() {
      // We have a problem with getting the bounds using leaflet - it looks like a timing error.  So do it ourselves.
      const isochrones = Object.values(this.$store.getters['isochrones/list'])
      let bounds = null

      if (isochrones && isochrones.length) {
        let swlat = null
        let swlng = null
        let nelat = null
        let nelng = null

        isochrones.forEach(i => {
          try {
            const wkt = new Wkt.Wkt()
            wkt.read(i.polygon)
            const obj = wkt.toObject()
            const thisbounds = obj.getBounds()
            const thissw = thisbounds.getSouthWest()
            const thisne = thisbounds.getNorthEast()

            swlat = swlat === null ? thissw.lat : Math.min(swlat, thissw.lat)
            swlng = swlng === null ? thissw.lng : Math.min(swlng, thissw.lng)
            nelat = nelat === null ? thisne.lat : Math.max(nelat, thisne.lat)
            nelng = nelng === null ? thisne.lng : Math.min(nelng, thisne.lng)
          } catch (e) {
            console.log('WKT parse error', i.polygon)
          }
        })

        if (swlat !== null) {
          bounds = new L.LatLngBounds([[swlat, swlng], [nelat, nelng]])
        }
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
