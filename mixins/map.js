export default {
  data: function() {
    return {
      lat: null,
      lng: null,
      map: null,
      bounds: null,
      center: [53.945, -2.5209],
      zoom: 5
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
      return this.bounds
        ? [
            (this.bounds.getNorthEast().lat + this.bounds.getSouthWest().lat) /
              2,
            (this.bounds.getNorthEast().lng + this.bounds.getSouthWest().lng) /
              2
          ]
        : null
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
    }
  }
}
