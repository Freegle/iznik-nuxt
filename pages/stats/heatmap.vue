<template>
  <div>
    <b-row class="text-center m-0">
      <b-col cols="12" md="6" offset-md="3">
        <h1>Freegling Heatmap</h1>
        <div v-if="!fetched" class="d-flex justify-content-around">
          <b-img-lazy src="~/static/loader.gif" alt="Loading" />
        </div>
        <div v-else>
          <p class="text-center">
            This shows where the most items have been freegled. It might take a little while to load.
          </p>
          <p class="text-center">
            The locations are approximate for privacy.  The colours are relative to the area currently shown.
          </p>
        </div>
        <client-only>
          <l-map
            ref="map"
            :zoom="5"
            :center="center"
            :style="'width: ' + mapWidth + '; height: ' + mapWidth + 'px'"
            :min-zoom="5"
            :max-zoom="13"
            @ready="idle"
          >
            <l-tile-layer :url="osmtile" :attribution="attribution" />
            <LeafletHeatmap
              v-if="fetched"
              :lat-lngs="weightedData"
              :gradient="{0.4: 'blue', 0.65: 'lime', 1: 'red'}"
            />
          </l-map>
        </client-only>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
import map from '@/mixins/map.js'

let LeafletHeatmap = null

if (process.browser) {
  LeafletHeatmap = () => import('~/components/Vue2LeaftletHeatmap')
}

export default {
  components: { LeafletHeatmap },
  mixins: [loginOptional, buildHead, map],
  data: function() {
    return {
      fetched: false,
      heatmap: null,
      weightedData: [],
      max: 0
    }
  },
  computed: {
    mapHeight() {
      const contWidth = this.$refs.mapcont ? this.$refs.mapcont.$el.width : 0
      return contWidth
    },
    mapWidth() {
      let height = 0

      if (process.browser) {
        height = Math.floor(window.innerHeight - 250)
        height = height < 200 ? 200 : height
      }

      return height
    }
  },
  methods: {
    async idle() {
      if (!this.fetched) {
        await this.$store.dispatch('stats/fetchHeatmap')

        const heatmap = this.$store.getters['stats/get']('Heatmap')

        const data = []
        heatmap.forEach(loc => {
          data.push([loc.lat, loc.lng, loc.count])
        })

        // We want to ensure that whatever level we're zoomed into, we show something useful.  So we need to weight
        // the data based on what the max value is in the current bounds.  If the max is too high then everything
        // else looks idle, so use a logarithmic scale.
        const bounds = this.$refs.map
          ? this.$refs.map.mapObject.getBounds()
          : null

        console.log('Bounds', bounds)

        if (bounds) {
          // If the max is too high, then everything else looks idle.  So use a logarithmic scale.
          let max = 0
          data.forEach(function(d) {
            max = Math.max(d[2], max)
          })

          const minlog = Math.log10(1)
          const maxlog = Math.log10(max)
          const range = maxlog - minlog
          const lineartolog = function(n) {
            return (Math.log10(n) - minlog) / range
          }

          const weighted = []

          data.forEach(d => {
            weighted.push([d[0], d[1], lineartolog(d[2])])
          })

          this.weightedData = weighted

          this.fetched = true
        }
      }
    }
  },
  head() {
    return this.buildHead(
      'Heatmap',
      'This shows where the most items have been freegled, in pretty colours.'
    )
  }
}
</script>
