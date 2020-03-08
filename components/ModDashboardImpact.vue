<template>
  <div>
    <h2>Impact</h2>
    <Impact :range="startf + ' - ' + endf" :total-benefit="totalBenefit" :total-c-o2="totalCO2" :total-weight="totalWeight" class="mt-2" />
  </div>
</template>
<script>
import Impact from './Impact'
import ModDashboardBase from '@/components/ModDashboardBase'

export default {
  components: { Impact },
  extends: ModDashboardBase,
  data: function() {
    return {
      askfor: []
    }
  },
  computed: {
    startf() {
      return this.$dayjs(this.start).format('YYYY-MM-DD')
    },
    endf() {
      return this.$dayjs(this.end).format('YYYY-MM-DD')
    },
    totalWeight() {
      const weights = this.$store.getters['stats/get']('Weight')
      let total = 0
      const start = this.$dayjs(this.start)
      const end = this.$dayjs(this.end)
      console.log('Got weights', weights, this.start, this.end)

      if (weights) {
        for (const w of weights) {
          console.log('Consider', w.date)
          if (
            start.isSameOrBefore(this.$dayjs(w.date), 'days') &&
            end.isSameOrAfter(this.$dayjs(w.date), 'days')
          ) {
            console.log('Include')
            total += w.count
          }
        }
      }

      return total / 1000
    },
    // Benefit of reuse per tonne is £711 and CO2 impact is -0.51tCO2eq based on WRAP figures.
    // http://www.wrap.org.uk/content/monitoring-tools-and-resources
    totalBenefit() {
      return this.totalWeight * 711
    },
    totalCO2() {
      return this.totalWeight * 0.51
    }
  }
}
</script>
