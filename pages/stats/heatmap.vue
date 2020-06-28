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
            The locations are approximate for privacy. The colours are relative to the area currently shown.
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
            @moveend="boundsChanged"
          >
            <l-tile-layer :url="osmtile" :attribution="attribution" />
            <LeafletHeatmap
              v-if="fetched"
              :key="'heatmap-' + weightedData.length"
              :lat-lngs="weightedData"
              :radius="zoom*6"
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
    },
    heatMapData() {
      const heatmap = this.$store.getters['stats/get']('Heatmap')

      const data = []
      heatmap.forEach(loc => {
        data.push([loc.lat, loc.lng, loc.count])
      })

      return data
    },
    weightedData() {
      const weighted = []

      // We want to ensure that whatever level we're zoomed into, we show something useful.  So we need to weight
      // the data based on what the max value is in the current bounds.  If the max is too high then everything
      // else looks idle, so use a logarithmic scale.
      let max = 0

      if (this.bounds) {
        // If the max is too high, then everything else looks idle.  So use a logarithmic scale.
        const data = []
        this.heatMapData.forEach(d => {
          if (this.bounds.contains([d[0], d[1]])) {
            max = Math.max(d[2], max)
            data.push(d)
          }
        })

        const minlog = Math.log10(1)
        const maxlog = Math.log10(max)
        const range = maxlog - minlog
        const lineartolog = function(n) {
          return (Math.log10(n) - minlog) / range
        }

        data.forEach(d => {
          if (this.bounds.contains([d[0], d[1]])) {
            weighted.push([d[0], d[1], lineartolog(d[2])])
          }
        })
      }

      return weighted
    }
  },
  methods: {
    async idle() {
      if (!this.fetched) {
        await this.$store.dispatch('stats/fetchHeatmap')
        this.fetched = true
        this.boundsChanged()
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
