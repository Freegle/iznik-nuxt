<template>
  <div v-if="clusters && clusters.length">
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
        @click="pointClick(cluster)"
      />
    </div>
  </div>
</template>
<script>
import Supercluster from 'supercluster/dist/supercluster'
import Vue from 'vue'
import { MAX_MAP_ZOOM } from '../utils/constants'
import ClusterIcon from './ClusterIcon'

let L = null

if (process.client) {
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
      default: MAX_MAP_ZOOM
    },
    minCluster: {
      type: Number,
      required: false,
      default: 10
    },
    tag: {
      type: Array,
      required: false,
      default: null
    },
    cssClass: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    points() {
      // Ensure that markers don't exactly overlap.  Simplistic.
      const ret = []
      const latlngs = []
      const bounds = this.map.getBounds()
      const nelng = bounds.getNorthWest().lng
      const nelat = bounds.getNorthWest().lat

      if (this.markers) {
        this.markers.forEach(marker => {
          if (marker.lat || marker.lng) {
            const key = marker.lat + '|' + marker.lng
            const already = latlngs[key] ? latlngs[key] : 0

            if (already) {
              marker.lat = Math.max(nelat, marker.lat + (already + 1) * 0.003)
              marker.lng = Math.max(nelng, marker.lng + (already + 1) * 0.003)
            }

            latlngs[key] = already + 1

            // Add a geoJSON point.
            ret.push({
              id: marker.id,
              type: 'Point',
              geometry: {
                coordinates: [marker.lng, marker.lat]
              }
            })
          }
        })
      }

      return ret
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
          if (this.markers.length < this.minCluster) {
            // We've seen some cases where Supercluster excludes some markers from the cluster, so that the sum of
            // what we get back is less than the number we passed in.  That isn't obvious except for low numbers of
            // markers, i.e. high zoom levels.  It may be a bug, but we don't much care - for our purposes the
            // actual numbers don't have to be spot on.  Using a minimum means that we can avoid that becoming
            // obvious.
            clusters = this.points
          } else {
            const bounds = this.map.getBounds()
            const zoom = Math.round(this.map.getZoom())
            let bbox = null

            try {
              if (bounds) {
                bbox = [
                  bounds.getNorthWest().lng,
                  bounds.getSouthEast().lat,
                  bounds.getSouthEast().lng,
                  bounds.getNorthWest().lat
                ]

                clusters = this.index.getClusters(bbox, zoom)
              }
            } catch (e) {
              console.log('Exception 1', e, bounds, zoom, this.index)
            }
          }
        }
      } catch (e) {
        console.log('Exception 2', e)
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
          count: cluster.properties ? cluster.properties.point_count : 1,
          tag: this.tag
        }
      })

      re = re.$mount().$el

      return new L.DivIcon({
        html: re.outerHTML,
        className: 'clear ' + this.cssClass
      })
    },
    clusterClick(cluster) {
      let zoom = this.index.getClusterExpansionZoom(
        cluster.properties.cluster_id
      )

      // Don't allow us to zoom in too far.
      zoom = Math.min(zoom, this.maxZoom)

      this.map.flyTo(
        [cluster.geometry.coordinates[1], cluster.geometry.coordinates[0]],
        zoom
      )

      this.$emit('click')
    },
    pointClick(cluster) {
      // It's a point. Centre on it, and zoom right in.
      this.map.flyTo(
        [cluster.geometry.coordinates[1], cluster.geometry.coordinates[0]],
        this.maxZoom
      )

      this.$emit('click')
    }
  }
}
</script>
