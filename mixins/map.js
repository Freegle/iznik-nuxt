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
    zoomChanged: function(zoom) {
      this.zoom = zoom
    },
    boundsChanged: function() {
      const bounds = this.$refs.map.mapObject.getBounds()

      this.bounds = {
        ne: {
          lat: bounds.getNorthEast().lat,
          lng: bounds.getNorthEast().lng
        },
        sw: {
          lat: bounds.getSouthWest().lat,
          lng: bounds.getSouthWest().lng
        }
      }

      this.setUrl()
    },
    idle: function(map) {
      this.boundsChanged()
    },
    bumpIt: function() {
      this.bump++
    }
  }
}
