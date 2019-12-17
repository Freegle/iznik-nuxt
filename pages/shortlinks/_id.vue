<template>
  <b-row class="m-0">
    <b-col cols="0" md="3" class="d-none d-md-block" />
    <b-col cols="12" md="6" class="p-0">
      <div v-if="shortlink">
        <h3>{{ shortlink.name }}</h3>
        <p>
          <a :href="'https://freegle.in/' + shortlink.name" target="_blank">{{ 'https://freegle.in/' + shortlink.name }}</a>
          is a shortlink for the community
          <nuxt-link :to="'/explore/' + shortlink.nameshort">
            {{ shortlink.nameshort }}
          </nuxt-link>.
        </p>
        <p>
          Here's a graph of clicks on this shortlink over time. If you don't see anything, there haven't been any yet!
        </p>
        <GChart
          type="LineChart"
          :data="chartData"
          :options="chartOptions"
        />
      </div>
    </b-col>
  </b-row>
</template>
<script>
import { GChart } from 'vue-google-charts'

export default {
  components: {
    GChart
  },
  data: function() {
    return {
      chartOptions: {
        interpolateNulls: false,
        legend: { position: 'none' },
        chartArea: { width: '80%', height: '80%' },
        vAxis: { viewWindow: { min: 0 } },
        hAxis: {
          format: 'MMM yyyy'
        },
        series: {
          0: { color: 'blue' }
        }
      }
    }
  },
  computed: {
    shortlink() {
      return this.$store.getters['shortlinks/get'](this.id)
    },
    chartData() {
      const ret = [['Date', 'Count']]

      if (this.shortlink) {
        for (const date of this.shortlink.clickhistory) {
          ret.push([new Date(date.date), date.count])
        }
      }

      return ret
    }
  },
  created() {
    this.id = this.$route.params.id
  },
  mounted() {
    this.$store.dispatch('shortlinks/fetch', {
      id: this.id
    })
  }
}
</script>
