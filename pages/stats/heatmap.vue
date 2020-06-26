<template>
  <div>
    <b-row class="text-center m-0">
      <b-col cols="12" md="6" offset-md="3">
        <h1>Freegling Heatmap</h1>
        <p class="text-center">
          This shows where the most items have been freegled. It might take a little while to load.
        </p>
        <p class="text-center">
          The locations are approximate for privacy.  The colours are relative to the area currently shown.
        </p>
        <client-only>
          Sorry, we've had to disable the map temporarily for cost reasons.
          <!--      TODO MAP-->
          <GmapMap
            v-if="false"
            ref="gmap"
            :center="{lat:53.9450, lng:-2.5209}"
            :zoom="5"
            :style="'width: ' + mapWidth + '; height: ' + mapWidth + 'px'"
            :options="{
              zoomControl: true,
              mapTypeControl: false,
              scaleControl: false,
              streetViewControl: false,
              rotateControl: false,
              fullscreenControl: true,
              disableDefaultUi: false,
              gestureHandling: 'greedy'
            }"
            @idle="idle"
          />
        </client-only>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { gmapApi } from 'vue2-google-maps'
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'

export default {
  components: {},
  mixins: [loginOptional, buildHead],
  data: function() {
    return {
      fetched: false,
      data: [],
      heatmap: null
    }
  },
  computed: {
    google: {
      get() {
        return process.browser ? gmapApi : []
      }
    },
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
      // Do this in idle rather than mount because Google doesn't like it if we mess with the map too early.
      const google = gmapApi()

      if (!this.fetched) {
        await this.$store.dispatch('stats/fetchHeatmap')
        const heatmap = this.$store.getters['stats/get']('Heatmap')
        this.fetched = true

        this.data = []
        heatmap.forEach(loc => {
          this.data.push({
            lat: loc.lat,
            lng: loc.lng,
            weight: loc.count
          })
        })
      }

      if (this.heatmap) {
        this.heatmap.setMap(null)
      }

      // Making the radius depend on the map zoom works fairly well.
      this.heatmap = new google.maps.visualization.HeatmapLayer({
        data: this.weightedData(),
        map: this.$refs.gmap.$mapObject,
        radius: this.$refs.gmap.$mapObject.getZoom()
      })
    },

    weightedData() {
      // We want to ensure that whatever level we're zoomed into, we show something useful.  So we need to weight
      // the data based on what the max value is in the current bounds.  If the max is too high then everything
      // else looks idle, so use a logarithmic scale.
      const google = gmapApi()
      const bounds = this.$refs.gmap.$mapObject.getBounds()

      const data = []

      // If the max is too high, then everything else looks idle.  So use a logarithmic scale.
      let max = 0
      this.data.forEach(function(d) {
        max = Math.max(d.weight, max)
      })

      const minlog = Math.log10(1)
      const maxlog = Math.log10(max)
      const range = maxlog - minlog
      const lineartolog = function(n) {
        return (Math.log10(n) - minlog) / range
      }

      this.data.forEach(d => {
        const p = new google.maps.LatLng(d.lat, d.lng)

        if (bounds.contains(p)) {
          data.push({
            location: p,
            weight: lineartolog(d.weight)
          })
        }
      })

      return data
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
