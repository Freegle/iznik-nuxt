let Wkt = null

if (process.browser) {
  Wkt = require('wicket')
  require('wicket/wicket-leaflet')
}

export default {
  data: function() {
    return {
      lat: null,
      lng: null,
      map: null,
      bounds: null,
      zoom: 5,
      bump: 1
    }
  },
  computed: {
    osmtile() {
      return process.env.OSM_TILE
    },
    attribution() {
      return 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    },
    mapHeight() {
      const contWidth = this.$refs.mapcont ? this.$refs.mapcont.$el.width : 0
      return contWidth
    },
    mapWidth() {
      let height = 0

      if (process.browser) {
        height = Math.floor(window.innerHeight / 2)
        height = height < 200 ? 200 : height
      }

      return height
    },
    center() {
      // Make this dependent on bump so that we can force re-evaluation.
      let ret = [53.945, -2.5209 + this.bump / 1000]

      const bounds = this.$refs.map
        ? this.$refs.map.mapObject.getBounds()
        : null

      if (bounds) {
        ret = [
          (bounds.getNorthEast().lat + bounds.getSouthWest().lat) / 2,
          (bounds.getNorthEast().lng + bounds.getSouthWest().lng) / 2
        ]
      }

      return ret
    }
  },
  methods: {
    setUrl: function() {
      // Override.
    },
    boundsChanged: function() {
      this.bounds = this.$refs.map.mapObject.getBounds()
      this.zoom = this.$refs.map.mapObject.getZoom()
      console.log('Bounds changed', this.bounds, this.zoom)
      this.setUrl()
    },
    idle: function(map) {
      this.boundsChanged()
    },
    bumpIt: function() {
      this.bump++
    },
    mapPoly: function(poly, options) {
      let bounds = null
      const wkt = new Wkt.Wkt()
      wkt.read(poly)

      const mapobj = this.$refs.map.mapObject
      const obj = wkt.toObject(mapobj.defaults)

      if (obj) {
        // This might be a multipolygon.
        if (Array.isArray(obj)) {
          for (const ent of obj) {
            ent.addTo(mapobj)
            ent.setStyle(options)
            const thisbounds = ent.getBounds()
            bounds.extend(thisbounds.getNorthEast())
            bounds.extend(thisbounds.getSouthWest())
          }
        } else {
          obj.addTo(mapobj)
          obj.setStyle(options)
          bounds = obj.getBounds()
        }
      }

      return bounds
    }
  }
}
