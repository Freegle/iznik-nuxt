<template>
  <div>
    <h2>Impact <span class="text-muted">on {{ groupName }}</span></h2>
    <p>This is our estimate of the impact your active communities have had.</p>
    <b-card v-if="loading" no-body>
      <b-card-body>
        <b-row><b-col>&nbsp;</b-col></b-row>
        <b-row><b-col>&nbsp;</b-col></b-row>
        <b-row>
          <b-col class="text-faded pulsate text-center">
            Loading...
          </b-col>
        </b-row>
        <b-row><b-col>&nbsp;</b-col></b-row>
        <b-row><b-col>&nbsp;</b-col></b-row>
        <b-row><b-col>&nbsp;</b-col></b-row>
      </b-card-body>
    </b-card>
    <Impact
      v-else
      :range="startf + ' - ' + endf"
      :total-benefit="totalBenefit"
      :total-c-o2="totalCO2"
      :total-weight="totalWeight"
      class="mt-2"
    />
  </div>
</template>
<script>
import ModDashboardBase from '@/components/ModDashboardBase'
import Impact from './Impact'

export default {
  components: { Impact },
  extends: ModDashboardBase,
  data: function() {
    return {
      askfor: ['Weight'],
      Weight: null
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
      const weights = this.Weight
      let total = 0
      const start = this.$dayjs(this.start)
      const end = this.$dayjs(this.end)

      if (weights) {
        for (const w of weights) {
          if (
            start.isSameOrBefore(this.$dayjs(w.date), 'days') &&
            end.isSameOrAfter(this.$dayjs(w.date), 'days')
          ) {
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
