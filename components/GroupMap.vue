<template>
  <div ref="mapcont" class="w-100">
    <client-only>
      <l-map
        ref="map"
        :style="'width: 100%; height: ' + mapHeight + 'px'"
        :min-zoom="minZoom"
        :max-zoom="maxZoom + 1"
        @ready="ready"
        @zoomend="idle"
        @moveend="idle"
      >
        <l-tile-layer :url="osmtile" :attribution="attribution" />
        <GroupMarker v-for="g in groupsInBounds" :key="'marker-' + g.id + '-' + zoom" :group="g" :size="largeMarkers ? 'rich' : 'poor'" />
      </l-map>
    </client-only>
  </div>
</template>
<script>
import GroupMarker from './GroupMarker'
import map from '@/mixins/map.js'
import waitForRef from '@/mixins/waitForRef'

let L = null

if (process.browser) {
  L = require('leaflet')
  require('leaflet-control-geocoder')
  require('leaflet-control-geocoder/dist/Control.Geocoder.css')
}

export default {
  components: {
    GroupMarker
  },
  mixins: [map, waitForRef],
  props: {
    initialBounds: {
      type: Object,
      required: true
    },
    heightFraction: {
      type: Number,
      required: false,
      default: 3
    },
    minZoom: {
      type: Number,
      required: false,
      default: 4
    },
    maxZoom: {
      type: Number,
      required: false,
      default: 9
    },
    region: {
      type: String,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      mapObject: null,
      bounds: null
    }
  },
  computed: {
    mapHeight() {
      let height = 0

      if (process.browser) {
        height = window.innerHeight / this.heightFraction - 70
        height = height < 200 ? 200 : height
      }

      return height
    },
    groups() {
      return this.$store.getters['group/list']
    },
    groupsInBounds() {
      const groups = this.groups
      const ret = []

      if (!process.browser) {
        // SSR - return all for SEO.
        for (const ix in groups) {
          const group = groups[ix]

          if (
            group.onmap &&
            (!this.region ||
              group.region.trim().toLowerCase() ===
                this.region.trim().toLowerCase())
          ) {
            ret.push(group)
          }
        }
      } else if (this.bounds) {
        for (const ix in groups) {
          const group = groups[ix]

          try {
            if (
              group.onmap &&
              this.bounds.contains([group.lat, group.lng]) &&
              (!this.region ||
                this.region.toLowerCase() === group.region.toLowerCase())
            ) {
              ret.push(group)
            }
          } catch (e) {
            console.log('Problem group', e)
          }
        }
      }

      const sorted = ret.sort((a, b) => {
        return a.namedisplay
          .toLowerCase()
          .localeCompare(b.namedisplay.toLowerCase())
      })

      return sorted
    },
    largeMarkers() {
      // Show small markers unless we are zoomed in to a small number of groups.
      return this.groupsInBounds.length < 20 && this.zoom > 10
    }
  },
  watch: {
    groupsInBounds(newval) {
      this.$emit('groups', this.groupsInBounds.map(g => g.id))
    }
  },
  methods: {
    ready() {
      this.waitForRef('map', () => {
        this.$emit('update:ready', true)
        this.mapObject = this.$refs.map.mapObject
        const self = this

        if (process.client) {
          L.Control.geocoder({
            geocoder: L.Control.Geocoder.photon({
              geocodingQueryParams: {
                bbox:
                  '-7.57216793459, 49.959999905, 1.68153079591, 58.6350001085'
              },
              nameProperties: [
                'name',
                'street',
                'suburb',
                'hamlet',
                'town',
                'city'
              ],
              serviceUrl:
                process.env.GEOCODE || 'https://geocode.ilovefreegle.org/api'
            }),
            collapsed: false
          })
            .on('markgeocode', function(e) {
              if (e && e.geocode && e.geocode.bbox) {
                // Empty out the query box so that the dropdown closes.
                this.setQuery('')

                self.$nextTick(() => {
                  // Move the map to the location we've found.
                  self.mapObject.fitBounds(e.geocode.bbox)
                })
              }
            })
            .addTo(this.mapObject)

          this.mapObject.fitBounds(this.initialBounds)
        }
      })
    },
    idle() {
      if (this.mapObject) {
        this.bounds = this.mapObject.getBounds()
        this.$emit('update:bounds', this.bounds)
        this.$emit('update:zoom', this.mapObject.getZoom())
        this.$emit('update:centre', this.mapObject.getCenter())

        if (this.mapObject.getZoom() > this.maxZoom) {
          // The parent will probably replace us with something else at this point.
          this.$emit('maxzoom')
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

@include media-breakpoint-up(md) {
  ::v-deep .leaflet-control-geocoder-form input {
    height: calc(1.5em + 1rem + 2px);
    padding: 0.5rem 1rem;
    font-size: 1.25rem !important;
    line-height: 1.5;
    border-radius: 0.3rem;
  }
}
</style>
