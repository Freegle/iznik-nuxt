<template>
  <b-card variant="white" class="mt-2">
    <b-card-text>
      <h3 class="d-flex justify-content-between">
        <span>
          {{ graphTitles[graphType] }}
        </span>
        <b-form-select v-model="graphType" :options="graphTypes" class="graphSelect" />
      </h3>
      <p v-if="graphType === 'Activity'">
        This includes people OFFERing something, posting a WANTED for something, or replying to an OFFER/WANTED.
      </p>
      <p v-if="graphType === 'ApprovedMessageCount'">
        This includes people OFFERing something or posting a WANTED for something.
      </p>
      <p v-if="graphType === 'Replies'">
        This includes people replying to an OFFER or a WANTED.
      </p>
      <GChart
        :key="graphType"
        :type="units === 'day' ? 'LineChart' : 'ColumnChart'"
        :data="graphData"
        :options="graphOptions"
      />
    </b-card-text>
  </b-card>
</template>
<script>
import { GChart } from 'vue-google-charts'

export default {
  components: {
    GChart
  },
  props: {
    groupid: {
      type: Number,
      required: false,
      default: null
    },
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  data: function() {
    return {
      graphType: 'Activity',
      graphTypes: [
        { value: 'Activity', text: 'Activity' },
        { value: 'ApprovedMessageCount', text: 'OFFERS/WANTEDs' },
        { value: 'Replies', text: 'Replies' }
      ],
      graphTitles: {
        Activity: 'Activity',
        ApprovedMessageCount: 'OFFERs and WANTED',
        Replies: 'Replies'
      }
    }
  },
  computed: {
    graphOptions() {
      let hformat

      if (this.units === 'week' || this.units === 'day') {
        hformat = 'DD MMM yyyy'
      } else if (this.units === 'month') {
        hformat = 'MMM yyyy'
      } else if (this.units === 'year') {
        hformat = 'yyyy'
      }

      return {
        title: this.graphTitles[this.graphType],
        interpolateNulls: false,
        animation: {
          duration: 5000,
          easing: 'out',
          startup: true
        },
        legend: { position: 'none' },
        chartArea: { width: '80%', height: '80%' },
        vAxis: { viewWindow: { min: 0 } },
        hAxis: {
          format: hformat
        },
        series: {
          0: { color: 'green' }
        },
        bar: { groupWidth: '100%' }
      }
    },
    duration() {
      const d = this.$dayjs(this.end)
        .endOf('day')
        .diff(this.$dayjs(this.start).startOf('day'), 'day')
      return d
    },
    units() {
      // Choose the units to display on the graph based on the range it covers.
      if (this.duration < 31) {
        return 'day'
      } else if (this.duration < 31 * 3) {
        return 'week'
      } else if (this.duration < 2 * 365) {
        return 'month'
      } else {
        return 'year'
      }
    },
    graphData() {
      const ret = [['Date', 'Count']]
      const activity = this.$store.getters['stats/get'](this.graphType)
      console.log('Duration', this.duration, this.units)
      const data = []
      const startd = this.$dayjs(this.start).startOf('day')
      const endd = this.$dayjs(this.end).endOf('day')

      if (activity) {
        console.log('Initial data', activity)
        for (const a of activity) {
          // Collect the data according to the unit.
          const thisdate = this.$dayjs(a.date)

          if (thisdate.isSameOrAfter(startd) && thisdate.isSameOrBefore(endd)) {
            const d = thisdate.startOf(this.units)
            if (data[d]) {
              data[d] += parseInt(a.count)
            } else {
              data[d] = parseInt(a.count)
            }
          } else {
            console.log('Exclude', a.date, this.start, this.end)
          }
        }

        console.log('collected data', data)

        for (const d in data) {
          ret.push([new Date(d), data[d]])
        }

        console.log('Converted data', ret)
      }

      return ret
    }
  }
}
</script>
<style scoped>
.graphSelect {
  max-width: 200px;
}
</style>
