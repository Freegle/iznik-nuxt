<template>
  <div>
    <b-row class="m-0">
      <b-col cols="12" lg="6" class="p-0" offset-lg="3">
        <b-row>
          <b-col>
            <GroupHeader v-if="group" :id="group.id" :key="'group-' + (group ? group.id : null)" :group="group" :show-join="false" />
            <div v-else>
              <div class="media pl-1 bg-white">
                <div class="media-left">
                  <div class="media-object">
                    <b-img thumbnail src="/icon.png" class="titlelogo" />
                  </div>
                </div>
                <div class="media-body ml-2">
                  <h2>Freegle</h2>
                  <h5>Give and get stuff for free in your local community. Don't throw it away, give it away!</h5>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
        <b-row v-if="loading">
          <b-col class="text-center">
            <b-img-lazy v-if="loading" src="~/static/loader.gif" alt="Loading..." />
          </b-col>
        </b-row>
        <div v-if="dataready">
          <b-card variant="white" class="mt-2">
            <b-card-text>
              <b-row class="p-0">
                <b-col class="text-center">
                  <v-icon name="balance-scale-left" class="purple" scale="4" />
                  <h2 class="purple">
                    {{ totalWeight.toLocaleString() }}
                    <br>
                    TONNES
                  </h2>
                </b-col>
                <b-col class="text-center">
                  <v-icon name="calculator" class="gold" scale="4" />
                  <h2 class="gold">
                    £{{ totalBenefit.toLocaleString() }}
                    <br>
                    BENEFIT
                  </h2>
                </b-col>
                <b-col class="text-center">
                  <v-icon name="cloud" class="green" scale="4" />
                  <h2 class="green">
                    {{ totalCO2.toLocaleString() }}
                    <br>
                    TONNES CO2
                  </h2>
                </b-col>
              </b-row>
              <b-row>
                <b-col class="text-center text-muted">
                  These three figures are totals over the last 12 months.
                </b-col>
              </b-row>
            </b-card-text>
          </b-card>
          <b-card variant="white" class="mt-2">
            <b-card-text>
              <h3>Activity</h3>
              <p>This includes people OFFERing something, posting a WANTED for something, or searching for something.</p>
              <GChart
                type="LineChart"
                :data="activityData"
                :options="activityOptions"
              />
            </b-card-text>
          </b-card>
          <b-row class="mt-2 chart-wrapper">
            <b-col>
              <b-card variant="white" class="chart">
                <b-card-text>
                  Here you can see how often people give things away compared to how often they ask for things.
                  <GChart
                    type="PieChart"
                    :data="balanceData"
                    :options="balanceOptions"
                  />
                </b-card-text>
              </b-card>
            </b-col>
            <b-col>
              <b-card variant="white" no-body class="chart">
                <b-card-body>
                  These charts show how often people are successful in giving something away or getting something - when they let us know!
                  <b-row class="p-0">
                    <b-col class="p-0">
                      <GChart
                        type="PieChart"
                        :data="offerOutcomeData"
                        :options="offerOutcomeOptions"
                      />
                    </b-col>
                    <b-col class="p-0">
                      <GChart
                        type="PieChart"
                        :data="wantedOutcomeData"
                        :options="wantedOutcomeOptions"
                      />
                    </b-col>
                  </b-row>
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>
          <b-card variant="white" class="mt-2">
            <b-card-text>
              <h3>Weights</h3>
              <p>
                This is an estimate of the weight of items we have diverted from the waste stream. People don't always
                tell us when things have worked, so it's likely to be an underestimate. Benefit and CO2 are calculated
                using a <a href="http://www.wrap.org.uk/content/monitoring-tools-and-resources" target="_blank">tool from WRAP</a>.
                Figures are only available since September 2016 and may change as we improve our estimates.
              </p>
              <GChart
                type="ColumnChart"
                :data="weightData"
                :options="weightOptions"
              />
            </b-card-text>
          </b-card>
          <b-card variant="white" class="mt-2">
            <b-card-text>
              <h3>Members</h3>
              <p>
                Here you can see how many members there are.
              </p>
              <GChart
                type="LineChart"
                :data="memberData"
                :options="memberOptions"
              />
            </b-card-text>
          </b-card>
          <p class="mt-2">
            If you want to find statistics for particular councils, click <nuxt-link to="/stats/authorities">
              here
            </nuxt-link>.
          </p>
        </div>
      </b-col>
      <b-col cols="0" md="3" class="d-none d-md-block" />
    </b-row>
  </div>
</template>
<style scoped lang="scss">
@import 'color-vars';

$bootstrap-sm: 768px;

.chart-wrapper {
  flex-direction: column;

  @media (min-width: $bootstrap-sm) {
    flex-direction: row;
  }
}

.card {
  &.chart {
    height: 100%;
  }
}

.titlelogo {
  width: 140px;
  height: 140px;
  object-fit: cover;
}

.purple {
  color: $color-purple !important;
}

.gold {
  color: $color-gold !important;
}

.green {
  color: green !important;
}
</style>
<script>
import dayjs from 'dayjs'
import { GChart } from 'vue-google-charts'
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'

const GroupHeader = () => import('~/components/GroupHeader.vue')

export default {
  components: {
    GChart,
    GroupHeader
  },
  mixins: [loginOptional, buildHead],
  data: function() {
    return {
      loading: false,
      dataready: false,
      group: null,
      activityOptions: {
        title: 'Activity',
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
          format: 'MMM yyyy'
        },
        series: {
          0: { color: 'blue' }
        }
      },
      balanceOptions: {
        title: 'Post Balance',
        chartArea: { width: '80%', height: '80%' },
        colors: ['green', 'blue'],
        slices2: {
          1: { offset: 0.2 },
          2: { offset: 0.2 }
        }
      },
      offerOutcomeOptions: {
        title: 'Offer Outcome',
        chartArea: { width: '80%', height: '80%' },
        colors: ['green', 'blue'],
        slices2: {
          1: { offset: 0.2 },
          2: { offset: 0.2 }
        }
      },
      wantedOutcomeOptions: {
        title: 'Wanted Balance',
        chartArea: { width: '80%', height: '80%' },
        colors: ['green', 'blue'],
        slices2: {
          1: { offset: 0.2 },
          2: { offset: 0.2 }
        }
      },
      weightOptions: {
        title: 'Weights (kg)',
        interpolateNulls: false,
        animation: {
          duration: 5000,
          easing: 'out',
          startup: true
        },
        legend: { position: 'none' },
        chartArea: { width: '80%', height: '80%' },
        bar: { groupWidth: '98%' },
        vAxis: { viewWindow: { min: 0 } },
        hAxis: {
          format: 'MMM yyyy'
        },
        series: {
          0: { color: 'green' }
        }
      },
      memberOptions: {
        title: 'Members',
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
          format: 'MMM yyyy'
        },
        series: {
          0: { color: 'blue' }
        }
      }
    }
  },
  computed: {
    totalWeight() {
      const weights = this.$store.getters['stats/get']('Weight')
      let total = 0

      if (weights) {
        for (const w of weights) {
          total += w.count
        }
      }

      return Math.round(total / 1000)
    },
    // Benefit of reuse per tonne is £711 and CO2 impact is -0.51tCO2eq based on WRAP figures.
    // http://www.wrap.org.uk/content/monitoring-tools-and-resources
    totalBenefit() {
      return Math.round(this.totalWeight * 711)
    },
    totalCO2() {
      return Math.round(this.totalWeight * 0.51)
    },
    activityData() {
      const ret = [['Date', 'Count']]
      const activity = this.$store.getters['stats/get']('Activity')

      if (activity) {
        for (const a of activity) {
          ret.push([new Date(a.date), parseInt(a.count)])
        }
      }

      return ret
    },
    balanceData() {
      const breakdown = this.$store.getters['stats/get']('MessageBreakdown')
      return [
        ['Type', 'Count'],
        ['Offer', parseInt(breakdown.Offer)],
        ['Wanted', parseInt(breakdown.Wanted)]
      ]
    },
    offerOutcomeData() {
      const breakdown = this.$store.getters['stats/get']('Outcomes')
      let totalOffer = 0
      let takenOffer = 0
      let withdrawnOffer = 0

      for (const d of breakdown.Offer) {
        totalOffer += d.count

        if (d.outcome === 'Taken') {
          takenOffer = d.count
        } else if (d.outcome === 'Withdrawn') {
          withdrawnOffer = d.count
        }
      }

      const ret = [
        ['Type', 'Count'],
        ['Taken', Math.round((100 * takenOffer) / totalOffer)],
        ['Withdrawn', Math.round((100 * withdrawnOffer) / totalOffer)]
      ]

      return ret
    },
    wantedOutcomeData() {
      const breakdown = this.$store.getters['stats/get']('Outcomes')
      let totalWanted = 0
      let receivedWanted = 0
      let withdrawnWanted = 0

      for (const d of breakdown.Wanted) {
        totalWanted += d.count

        if (d.outcome === 'Received') {
          receivedWanted = d.count
        } else if (d.outcome === 'Withdrawn') {
          withdrawnWanted = d.count
        }
      }

      const ret = [
        ['Type', 'Count'],
        ['Received', Math.round((100 * receivedWanted) / totalWanted)],
        ['Withdrawn', Math.round((100 * withdrawnWanted) / totalWanted)]
      ]

      return ret
    },
    memberData() {
      const ret = [['Date', 'Count']]
      const members = this.$store.getters['stats/get']('ApprovedMemberCount')

      if (members) {
        for (const a of members) {
          ret.push([new Date(a.date), parseInt(a.count)])
        }
      }

      return ret
    },
    weightData() {
      const ret = [['Date', 'Count']]
      const activity = this.$store.getters['stats/get']('Weight')
      let lastmon = null
      let count = 0

      if (activity) {
        for (const a of activity) {
          const mon = a.date.substring(0, 7)

          if (mon !== lastmon) {
            if (lastmon !== null) {
              ret.push([new Date(lastmon + '-01'), count])
              count = 0
            }

            lastmon = mon
          }

          count += a.count
        }
      }

      return ret
    }
  },
  created() {
    this.groupname = this.$route.params.groupname
  },

  async mounted() {
    let groupid = null
    this.loading = true

    if (this.groupname) {
      // Convert the name to an id.
      await this.$store.dispatch('group/fetch', {
        id: this.groupname
      })

      const groups = this.$store.getters['group/list']
      for (const ix in groups) {
        const group = groups[ix]

        if (group.nameshort.toLowerCase() === this.groupname.toLowerCase()) {
          groupid = group.id
          this.group = group
        }
      }
    }

    const start = dayjs()
      .subtract(1, 'year')
      .subtract(1, 'month')
      .set('day', 1)
      .format('YYYY-MM-DD')

    await this.$store.dispatch('stats/clear')
    await this.$store.dispatch('stats/fetch', {
      group: groupid,
      grouptype: 'Freegle',
      systemwide: groupid === null,
      start: start
    })

    this.loading = false
    this.$nextTick(() => {
      // This is a bit of a hack to make sure everything is in the DOM and the data is ready, otherwise the charts
      // break.
      this.dataready = true
    })
  },
  head() {
    if (this.groupname) {
      return this.buildHead(
        'Statistics for ' + this.groupname,
        'See stats and graphs for ' + this.groupname,
        this.group ? this.group.profile : null
      )
    } else {
      return this.buildHead('Statistics', 'See stats and graphs for Freegle')
    }
  },

  methods: {}
}
</script>
