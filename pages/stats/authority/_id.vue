<template>
  <div>
    <b-row class="m-0">
      <b-col cols="0" md="3" class="d-none d-md-block" />
      <b-col v-if="authority" cols="12" md="6" class="p-0">
        <div class="title pl-2">
          <b-img thumbnail src="/icon.png" class="titlelogo float-right" />
          <span class="head">
            {{ authority.name }}
          </span>
          <br>
          <v-icon name="globe-europe" /> www.iLoveFreegle.org  <v-icon name="brands/twitter" /> @thisisfreegle  <v-icon name="brands/facebook" /> facebook.com/Freegle
        </div>
        <b-card variant="white" class="border-white">
          <b-card-text>
            <b-row class="p-0">
              <b-col class="text-center">
                <v-icon name="balance-scale-left" class="gold titleicon" scale="3" />
                <h5 class="gold">
                  {{ totalWeight.toLocaleString() }}
                  <br>
                  TONNES
                  <br>
                  <span class="text-muted small">
                    {{ range }}
                  </span>
                </h5>
              </b-col>
              <b-col class="text-center">
                <v-icon name="calculator" class="gold titleicon" scale="3" />
                <h5 class="gold">
                  £{{ totalBenefit.toLocaleString() }}
                  <br>
                  BENEFIT
                  <br>
                  <span class="text-muted small">
                    {{ range }}
                  </span>
                </h5>
              </b-col>
              <b-col class="text-center">
                <v-icon name="cloud" class="gold titleicon" scale="3" />
                <h5 class="gold">
                  {{ totalCO2.toLocaleString() }}
                  <br>
                  TONNES CO2
                  <br>
                  <span class="text-muted small">
                    {{ range }}
                  </span>
                </h5>
              </b-col>
              <b-col class="text-center">
                <v-icon name="gift" class="purple titleicon" scale="3" />
                <h5 class="purple">
                  {{ totalGifts.toLocaleString() }}
                  <br>
                  GIFTS MADE
                  <br>
                  <span class="text-muted small">
                    {{ range }}
                  </span>
                </h5>
              </b-col>
              <b-col class="text-center">
                <v-icon name="users" class="text-primary titleicon" scale="3" />
                <h5 class="text-primary">
                  {{ totalMembers.toLocaleString() }}
                  <br>
                  MEMBERS
                  <br>
                  <span class="text-muted small">
                    {{ end }}
                  </span>
                </h5>
              </b-col>
              <b-col />
            </b-row>
          </b-card-text>
        </b-card>
        <b-row class="m-0">
          <b-col class="border border-white p-0 bg-white text-center">
            <H5>WEIGHTS (KG)</H5>
          </b-col>
          <b-col class="border border-white p-0 bg-white text-center">
            <H5>MEMBERS</H5>
          </b-col>
        </b-row>
        <b-row class="m-0">
          <b-col class="border border-white p-0 bg-white">
            <GChart
              type="ColumnChart"
              :data="weightData"
              :options="weightOptions"
            />
          </b-col>
          <b-col class="border border-white p-0 bg-white">
            <GChart
              type="LineChart"
              :data="memberData"
              :options="memberOptions"
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>
<style scoped lang="scss">
@import 'color-vars';

.title {
  background-color: green;
  color: white !important;
}

.titlelogo {
  width: 72px;
}

.titleicon {
  width: 2rem;
  height: 2rem;
}

.head {
  font-size: 2rem;
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
// TODO Remove navbar
// TODO Date filter

export default {
  components: {
    GChart
  },
  mixins: [loginOptional],
  data() {
    return {
      // No animations as we want the SSR to return the whole thing.
      weightOptions: {
        interpolateNulls: false,
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
    totalWeight() {
      let total = 0

      for (const groupid in this.stats) {
        const overlap = this.overlap(groupid)
        const stat = this.stats[groupid]
        for (const w of stat.Weights) {
          total += w.count * overlap
        }
      }

      return Math.round(total / 100) / 10
    },
    // Benefit of reuse per tonne is £711 and CO2 impact is -0.51tCO2eq based on WRAP figures.
    // http://www.wrap.org.uk/content/monitoring-tools-and-resources
    totalBenefit() {
      return Math.round(this.totalWeight * 711)
    },
    totalCO2() {
      return Math.round(this.totalWeight * 0.51 * 10000) / 10000
    },
    totalGifts() {
      let count = 0

      for (const groupid in this.stats) {
        const overlap = this.overlap(groupid)
        const stat = this.stats[groupid]
        const outcomes = stat.OutcomesPerMonth

        for (const outcome in outcomes) {
          count += outcomes[outcome].count * overlap
        }
      }

      return Math.round(count)
    },
    weightData() {
      const ret = [['Date', 'Count']]
      let lastmon = null
      let count = 0

      for (const groupid in this.stats) {
        const overlap = this.overlap(groupid)
        const stat = this.stats[groupid]
        const weight = stat.Weights

        for (const a of weight) {
          const mon = a.date.substring(0, 7)

          if (mon !== lastmon) {
            if (lastmon !== null) {
              ret.push([new Date(lastmon + '-01'), count])
              count = 0
            }

            lastmon = mon
          }

          count += a.count * overlap
        }
      }

      return ret
    },
    memberData() {
      const ret = [['Date', 'Count']]
      const dates = []

      for (const groupid in this.stats) {
        const overlap = this.overlap(groupid)
        const stat = this.stats[groupid]
        const members = stat.ApprovedMemberCount

        if (members) {
          for (const a of members) {
            if (!dates[a.date]) {
              dates[a.date] = 0
            }

            dates[a.date] += parseInt(a.count) * overlap
          }
        }
      }

      for (const date in dates) {
        ret.push([new Date(date), Math.round(dates[date])])
      }

      return ret
    },
    totalMembers() {
      let ret = 0
      const data = this.memberData
      if (data) {
        const last = data.pop()
        ret = last[1]
      }
      return ret
    },
    range() {
      const start = dayjs()
        .subtract(1, 'year')
        .startOf('month')
        .format('MMM YY')
        .toUpperCase()
      const end = dayjs()
        .subtract(1, 'month')
        .endOf('month')
        .format('MMM YY')
        .toUpperCase()
      return start + ' - ' + end
    },
    end() {
      const end = dayjs()
        .subtract(1, 'month')
        .endOf('month')
        .format('MMM YY')
        .toUpperCase()
      return end
    }
  },
  async asyncData({ app, params, store }) {
    // TODO This is slow, which means the page is very slow to load.
    await store.dispatch('authorities/fetch', {
      id: params.id
    })

    const stats = []
    const authority = store.getters['authorities/get'](params.id)
    const start = dayjs()
      .subtract(1, 'year')
      .startOf('month')
      .format('YYYY-MM-DD')
    const end = dayjs()
      .subtract(1, 'month')
      .endOf('month')
      .format('YYYY-MM-DD')

    for (const group of authority.groups) {
      await store.dispatch('stats/clear')
      await store.dispatch('stats/fetch', {
        group: group.id,
        grouptype: 'Freegle',
        start: start,
        end: end
      })

      stats[group.id] = {
        Weights: store.getters['stats/get']('Weight'),
        ApprovedMemberCount: store.getters['stats/get']('ApprovedMemberCount'),
        OutcomesPerMonth: store.getters['stats/get']('OutcomesPerMonth')
      }
    }

    return {
      authority: authority,
      stats: stats
    }
  },
  created() {
    this.id = this.$route.params.id
  },
  methods: {
    overlap: function(groupid) {
      for (const group of this.authority.groups) {
        if (parseInt(group.id) === parseInt(groupid)) {
          return group.overlap
        }
      }

      return 0
    }
  }
}
</script>
