import waitForRef from '../mixins/waitForRef'

let Wkt = null

if (process.browser) {
  Wkt = require('wicket')
  require('wicket/wicket-leaflet')
}

export default {
  mixins: [waitForRef],
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
    mapWidth() {
      console.log('Calculate width', this.$refs.mapcont)
      const contWidth = this.$refs.mapcont ? this.$refs.mapcont.clientWidth : 0
      console.log('Return', contWidth)
      return contWidth + this.bump - this.bump
    },
    mapHeight() {
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
  mounted() {
    // We have to wait for the ref to appear and then trigger a recompute of the mapWidth property.
    console.log('Wait for mapcont')
    this.waitForRef('mapcont', () => {
      console.log('Found')
      this.bumpIt()
    })
  },
  watch: {
    mapWidth() {
      if (this.$refs.map && this.$refs.map.mapObject) {
        this.$refs.map.mapObject.invalidateSize()
      }
    },
    mapHeight() {
      if (this.$refs.map && this.$refs.map.mapObject) {
        this.$refs.map.mapObject.invalidateSize()
      }
    }
  },
  methods: {
    setUrl: function() {
      // Override.
    },
    boundsChanged: function() {
      this.bounds = this.$refs.map.mapObject.getBounds()
      this.zoom = this.$refs.map.mapObject.getZoom()
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
    },
    toRadian: function(degree) {
      return (degree * Math.PI) / 180
    },
    getDistance: function(origin, destination) {
      // return distance in meters
      const lon1 = this.toRadian(origin[1])
      const lat1 = this.toRadian(origin[0])
      const lon2 = this.toRadian(destination[1])
      const lat2 = this.toRadian(destination[0])

      const deltaLat = lat2 - lat1
      const deltaLon = lon2 - lon1

      const a =
        Math.pow(Math.sin(deltaLat / 2), 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2)
      const c = 2 * Math.asin(Math.sqrt(a))
      const EARTH_RADIUS = 6371
      return c * EARTH_RADIUS * 1000
    }
  }
}
