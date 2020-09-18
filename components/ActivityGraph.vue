<template>
  <b-card variant="white" class="mt-2">
    <b-card-text>
      <h3 class="d-flex justify-content-between flex-wrap">
        <span>
          {{ graphTitles[graphType] }} <span v-if="groupName" class="text-muted">on {{ groupName }}</span>
        </span>
        <div class="d-flex">
          <b-form-select v-if="graphType !== 'ActiveUsers'" v-model="units" :options="unitOptions" class="graphSelect mr-1" />
          <b-form-select v-model="graphType" :options="graphTypes" class="graphSelect" />
        </div>
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
      <p v-if="graphType === 'Offers'">
        Just OFFERs.  This is estimated from the message total and the split by type across the whole period.
      </p>
      <p v-if="graphType === 'Wanteds'">
        Just WANTEDs.  This is estimated from the message total and the split by type across the whole period.
      </p>
      <p v-if="graphType === 'Weight'">
        These are weight estimates based on the items which we know are TAKEN/RECEIVED.
      </p>
      <p v-if="graphType === 'Outcomes'">
        These are the posts marked as TAKEN/RECEIVED.
      </p>
      <p v-if="graphType === 'Donations'">
        These are donations received via PayPal.
      </p>
      <p v-if="graphType === 'ActiveUsers'">
        This is the number of freeglers active in the 30 days before each date.  Only available for individual communities
        at the moment; if you add up across communities you'll get the wrong number because the same freegler might be active on
        multiple communities.  Data valid from around the start of September 2020.  Only includes freeglers who logged
        in.
      </p>
      <div v-if="loading" class="height text-muted pulsate align-middle d-flex flex-column">
        Loading...
      </div>
      <GChart
        v-else
        :key="graphType"
        :type="(graphType === 'ActiveUsers' || units === 'day') ? 'LineChart' : 'ColumnChart'"
        :data="graphData"
        :options="graphOptions"
      />
    </b-card-text>
  </b-card>
</template>
<script>
import Vue from 'vue'
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
    groupName: {
      type: String,
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
    },
    offers: {
      type: Boolean,
      required: false,
      default: false
    },
    wanteds: {
      type: Boolean,
      required: false,
      default: false
    },
    weights: {
      type: Boolean,
      required: false,
      default: false
    },
    successful: {
      type: Boolean,
      required: false,
      default: false
    },
    donations: {
      type: Boolean,
      required: false,
      default: false
    },
    activeusers: {
      type: Boolean,
      required: false,
      default: false
    },
    systemwide: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    const ret = {
      loading: true,
      askfor: ['ApprovedMessageCount', 'Activity', 'Replies', 'Donations'],
      MessageBreakdown: null,
      ApprovedMessageCount: null,
      Activity: null,
      Replies: null,
      Weight: null,
      Outcomes: null,
      Donations: null,
      ActiveUsers: null,
      graphType: 'Activity',
      graphTypes: [],
      graphTitles: {
        Activity: 'Activity',
        ApprovedMessageCount: 'OFFERs and WANTED',
        Replies: 'Replies',
        Offers: 'OFFERs only',
        Wanteds: 'WANTEDs only',
        Weight: 'Weights',
        Outcomes: 'Successful',
        Donations: 'PayPal Donations',
        ActiveUsers: 'Active freeglers'
      },
      units: 'year',
      unitOptions: [
        {
          value: 'day',
          text: 'Day'
        },
        {
          value: 'week',
          text: 'Week'
        },
        {
          value: 'month',
          text: 'Month'
        },
        {
          value: 'year',
          text: 'Year'
        }
      ]
    }

    ret.graphTypes.push({ value: 'Activity', text: 'Activity' })

    ret.graphTypes.push({
      value: 'ApprovedMessageCount',
      text: 'OFFERS+WANTEDs'
    })

    if (this.successful) {
      ret.graphTypes.push({ value: 'Outcomes', text: 'Successful posts' })
    }

    if (this.offers) {
      ret.graphTypes.push({ value: 'Offers', text: 'Just OFFERs' })
    }

    if (this.wanteds) {
      ret.graphTypes.push({ value: 'Wanteds', text: 'Just WANTEDs' })
    }

    if (this.weights) {
      ret.graphTypes.push({ value: 'Weight', text: 'Weight estimates' })
    }

    if (this.donations) {
      ret.graphTypes.push({ value: 'Donations', text: 'PayPal Donations' })
    }

    if (this.activeusers && (this.groupid === -2 || this.groupid > 0)) {
      // Only available systemwide or on individual groups.
      ret.graphTypes.push({ value: 'ActiveUsers', text: 'Active Freeglers' })
    }

    ret.graphTypes.push({ value: 'Replies', text: 'Replies' })

    return ret
  },
  computed: {
    graphOptions() {
      let hformat

      const units = this.graphType === 'ActiveUsers' ? 'day' : this.units

      if (units === 'week' || units === 'day') {
        hformat = 'dd MMM yyyy'
      } else if (units === 'month') {
        hformat = 'MMM yyyy'
      } else if (units === 'year') {
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
    graphData() {
      const ret = [['Date', 'Count']]
      const activity = this[this.graphType]
      const data = []
      const startd = this.$dayjs(this.start).startOf('day')
      const endd = this.$dayjs(this.end).endOf('day')

      const units = this.graphType === 'ActiveUsers' ? 'day' : this.units

      if (activity) {
        for (const a of activity) {
          // Collect the data according to the unit.
          const thisdate = this.$dayjs(a.date)

          if (thisdate.isSameOrAfter(startd) && thisdate.isSameOrBefore(endd)) {
            const d = thisdate.startOf(units)
            if (data[d]) {
              data[d] += parseInt(a.count)
            } else {
              data[d] = parseInt(a.count)
            }
          } else {
            console.log('Exclude', a.date, this.start, this.end)
          }
        }

        for (const d in data) {
          let lab = null

          if (units === 'day') {
            lab = new Date(d)
          } else if (units === 'week') {
            lab = 'w/c ' + this.$dayjs(d).format('DD-MMM')
          } else if (units === 'month') {
            lab = this.$dayjs(d).format('MMM YYYY')
          } else if (units === 'year') {
            lab = this.$dayjs(d).format('YYYY')
          }

          ret.push([lab, data[d]])
        }
      }

      return ret
    },
    Offers() {
      return this.approvedSplit(this.graphType)
    },
    Wanteds() {
      return this.approvedSplit(this.graphType)
    }
  },
  watch: {
    start() {
      this.maybeFetch()
    },
    end() {
      this.maybeFetch()
    },
    groupid() {
      this.maybeFetch()
    },
    graphType() {
      this.maybeFetch()
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    async fetch() {
      this.loading = true

      this.units = this.defaultUnits()

      let comp = [this.graphType]

      if (this.graphType === 'Offers' || this.graphType === 'Wanteds') {
        // These are not stored separately by the server so we get the total and the split.
        comp = ['ApprovedMessageCount', 'MessageBreakdown']
      }

      const res = await this.$api.dashboard.fetch({
        components: comp,
        start: this.start.toISOString(),
        end: this.end.toISOString(),
        allgroups: !this.systemwide && !this.groupid,
        group: this.groupid > 0 ? this.groupid : null,
        systemwide: this.systemwide,
        suppliedgroup: this.groupid
      })

      Object.keys(res).forEach(comp => {
        // eslint-disable-next-line
        Vue.set(this, comp, res[comp])
      })

      this.loading = false
    },
    maybeFetch() {
      if (!this.loading) {
        this.loading = true

        this.$nextTick(() => {
          this.fetch()
        })
      }
    },
    approvedSplit(type) {
      // We want to return the approved message count, adjusted by the message breakdown for this type.
      type = type.replace('s', '')

      const factor =
        this.MessageBreakdown[type] /
        (this.MessageBreakdown.Offer + this.MessageBreakdown.Wanted)
      console.log('Factor', factor)

      const ret = []
      this.ApprovedMessageCount.forEach(ent => {
        ret.push({
          date: ent.date,
          count: Math.round(ent.count) * factor
        })
      })

      return ret
    },
    defaultUnits() {
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
    }
  }
}
</script>
<style scoped>
.graphSelect {
  max-width: 200px;
}

.height {
  height: 200px;
}
</style>
