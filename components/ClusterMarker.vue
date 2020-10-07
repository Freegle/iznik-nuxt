<template>
  <div>
    <div v-for="cluster in clusters" :key="'cluster-' + cluster.id">
      <l-marker
        v-if="cluster.properties"
        :lat-lng="[ cluster.geometry.coordinates[1], cluster.geometry.coordinates[0] ]"
        :interactive="false"
        :title="cluster.properties"
        :icon="icon(cluster)"
        @click="clusterClick(cluster)"
      />
      <l-marker
        v-else
        :lat-lng="[ cluster.geometry.coordinates[1], cluster.geometry.coordinates[0] ]"
        :interactive="false"
        :icon="icon(cluster)"
      />
    </div>
  </div>
</template>
<script>
import Supercluster from 'supercluster/dist/supercluster'
import Vue from 'vue'
import ClusterIcon from './ClusterIcon'

let L = null

if (process.browser) {
  L = require('leaflet')
}

export default {
  props: {
    // Array of { id, lat, lng }
    markers: {
      type: Array,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    radius: {
      type: Number,
      required: false,
      default: 60
    },
    extent: {
      type: Number,
      required: false,
      default: 256
    },
    minZoom: {
      type: Number,
      required: false,
      default: 0
    },
    maxZoom: {
      type: Number,
      required: false,
      default: 16
    }
  },
  computed: {
    nonOverlappingMarkers() {
      // Ensure that markers don't exactly overlap.  Simplistic.
      const ret = []
      const latlngs = []

      if (this.markers) {
        this.markers.forEach(marker => {
          if (marker.lat || marker.lng) {
            let key = marker.lat + '|' + marker.lng

            while (latlngs[key]) {
              marker.lat += 0.003
              marker.lng += 0.003
              key = marker.lat + '|' + marker.lng
            }

            latlngs[key] = true
            ret.push({
              id: marker.id,
              lat: marker.lat,
              lng: marker.lng
            })
          }
        })
      }

      return ret
    },
    points() {
      // Convert into GeoJSON Points.
      return this.nonOverlappingMarkers.map(m => {
        return {
          id: m.id,
          type: 'Point',
          geometry: {
            coordinates: [m.lng, m.lat]
          }
        }
      })
    },
    index() {
      // Generate the index.  It's immutable, so we need to generate a new index each time the points change.
      const index = new Supercluster({
        radius: this.radius,
        extent: this.extent,
        maxZoom: this.maxZoom,
        minZoom: this.minZoom
      })

      index.load(this.points)

      return index
    },
    clusters(index) {
      let clusters = []

      try {
        if (this.map) {
          const bounds = this.map.getBounds()
          const zoom = this.map.getZoom()

          if (bounds) {
            const bbox = [
              bounds.getNorthWest().lng,
              bounds.getSouthEast().lat,
              bounds.getSouthEast().lng,
              bounds.getNorthWest().lat
            ]

            clusters = this.index.getClusters(bbox, zoom)
          }
        }
      } catch (e) {
        console.log('Excetion', e)
      }

      return clusters
    }
  },
  methods: {
    icon(cluster) {
      // To add a divicon we render the component off document and pass in the count (if a cluster) or 1 (if not).
      const Mine = Vue.extend(ClusterIcon)

      let re = new Mine({
        propsData: {
          count: cluster.properties ? cluster.properties.point_count : 1
        }
      })

      re = re.$mount().$el

      return new L.DivIcon({
        html: re.outerHTML,
        className: 'clear'
      })
    },
    clusterClick(cluster) {
      console.log('Clustger click', cluster)
      if (cluster.properties) {
        // It's a cluster (rather than a point).
        const zoom = this.index.getClusterExpansionZoom(
          cluster.properties.cluster_id
        )
        this.map.setZoom(zoom)
      }
    }
  }
}
</script>
