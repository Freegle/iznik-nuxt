<template>
  <div>
    <div v-if="stats">
      <div v-if="tables">
        <b-row class="m-0">
          <b-col cols="0" md="3" class="d-none d-md-block" />
          <b-col v-if="authority" cols="12" md="6" class="p-0 bg-white">
            <b-img thumbnail src="/icon.png" class="titlelogo float-right" @click="toggle" />
            <h2>Freegle in {{ authority.name }}</h2>
            <p>This is a report of the last 3 complete months.</p>
            <h3>Local Authority Data</h3>
            <b-table-simple>
              <b-thead>
                <b-tr>
                  <b-th />
                  <b-th>{{ last3MonthsLabels[0].toLocaleString() }}</b-th>
                  <b-th>{{ last3MonthsLabels[1].toLocaleString() }}</b-th>
                  <b-th>{{ last3MonthsLabels[2].toLocaleString() }}</b-th>
                  <b-th>Total</b-th>
                </b-tr>
              </b-thead>
              <b-tbody>
                <b-tr>
                  <b-td>Memberships</b-td>
                  <b-td>{{ last3MonthsMembersTotal[0] ? last3MonthsMembersTotal[0].toLocaleString() : '-' }}</b-td>
                  <b-td>{{ last3MonthsMembersTotal[1] ? last3MonthsMembersTotal[1].toLocaleString() : '-' }}</b-td>
                  <b-td>{{ last3MonthsMembersTotal[2] ? last3MonthsMembersTotal[2].toLocaleString() : '-' }}</b-td>
                  <b-td>{{ last3MonthsMembersTotal[2] ? last3MonthsMembersTotal[2].toLocaleString() : '-' }}</b-td>
                </b-tr>
                <b-tr>
                  <b-td>Individuals</b-td>
                  <b-td>{{ last3MonthsUsersTotal[0] ? last3MonthsUsersTotal[0].toLocaleString() : '-' }}</b-td>
                  <b-td>{{ last3MonthsUsersTotal[1] ? last3MonthsUsersTotal[1].toLocaleString() : '-' }}</b-td>
                  <b-td>{{ last3MonthsUsersTotal[2] ? last3MonthsUsersTotal[2].toLocaleString() : '-' }}</b-td>
                  <b-td>{{ last3MonthsUsersTotal[2] ? last3MonthsUsersTotal[2].toLocaleString() : '-' }}</b-td>
                </b-tr>
                <b-tr>
                  <b-td>Kilograms reused</b-td>
                  <b-td>{{ last3MonthsKgsTotal[0] ? last3MonthsKgsTotal[0].toLocaleString() : '-' }}</b-td>
                  <b-td>{{ last3MonthsKgsTotal[1] ? last3MonthsKgsTotal[1].toLocaleString() : '-' }}</b-td>
                  <b-td>{{ last3MonthsKgsTotal[2] ? last3MonthsKgsTotal[2].toLocaleString() : '-' }}</b-td>
                  <b-td>{{ ((last3MonthsKgsTotal[0] ? last3MonthsKgsTotal[0] : 0) + (last3MonthsKgsTotal[1] ? last3MonthsKgsTotal[1] : 0) + (last3MonthsKgsTotal[2] ? last3MonthsKgsTotal[2] : 0)).toLocaleString() }}</b-td>
                </b-tr>
                <b-tr>
                  <b-td>CO2 saved (tonnes)</b-td>
                  <b-td>{{ last3MonthsCO2Total[0] }}</b-td>
                  <b-td>{{ last3MonthsCO2Total[1] }}</b-td>
                  <b-td>{{ last3MonthsCO2Total[2] }}</b-td>
                  <b-td>{{ Math.round(100 * (last3MonthsCO2Total[0] + last3MonthsCO2Total[1] + last3MonthsCO2Total[2])) / 100 }}</b-td>
                </b-tr>
                <b-tr>
                  <b-td>Benefit (£)</b-td>
                  <b-td>{{ last3MonthsBenefitTotal[0] ? last3MonthsBenefitTotal[0].toLocaleString() : '-' }}</b-td>
                  <b-td>{{ last3MonthsBenefitTotal[1] ? last3MonthsBenefitTotal[1].toLocaleString() : '-' }}</b-td>
                  <b-td>{{ last3MonthsBenefitTotal[2] ? last3MonthsBenefitTotal[2].toLocaleString() : '-' }}</b-td>
                  <b-td>{{ ((last3MonthsBenefitTotal[0] ? last3MonthsBenefitTotal[0] : 0) + (last3MonthsBenefitTotal[1] ? last3MonthsBenefitTotal[1] : 0) + (last3MonthsBenefitTotal[2] ? last3MonthsBenefitTotal[2] : 0)).toLocaleString() }}</b-td>
                </b-tr>
                <b-tr>
                  <b-td>Gifts</b-td>
                  <b-td>{{ last3MonthsGiftsTotal[0] ? last3MonthsGiftsTotal[0].toLocaleString() : '-' }}</b-td>
                  <b-td>{{ last3MonthsGiftsTotal[1] ? last3MonthsGiftsTotal[1].toLocaleString() : '-' }}</b-td>
                  <b-td>{{ last3MonthsGiftsTotal[2] ? last3MonthsGiftsTotal[2].toLocaleString() : '-' }}</b-td>
                  <b-td>{{ ((last3MonthsGiftsTotal[0] ? last3MonthsGiftsTotal[0] : 0) + (last3MonthsGiftsTotal[1] ? last3MonthsGiftsTotal[1] : 0) + (last3MonthsGiftsTotal[2] ? last3MonthsGiftsTotal[2] : 0)).toLocaleString() }}</b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
            <h3>Freegle Community Data</h3>
            <b-table-simple>
              <b-thead>
                <b-tr>
                  <b-th />
                  <b-th colspan="4" class="text-center">
                    Membership
                  </b-th>
                  <b-th colspan="4" class="text-center">
                    Kilograms reused
                  </b-th>
                </b-tr>
                <b-tr>
                  <b-th>Community</b-th>
                  <b-th class="bg-light">
                    {{ last3MonthsLabels[0].toLocaleString() }}
                  </b-th>
                  <b-th class="bg-light">
                    {{ last3MonthsLabels[1].toLocaleString() }}
                  </b-th>
                  <b-th class="bg-light">
                    {{ last3MonthsLabels[2].toLocaleString() }}
                  </b-th>
                  <b-th class="bg-light">
                    Change
                  </b-th>
                  <b-th class="bg-info">
                    {{ last3MonthsLabels[0].toLocaleString() }}
                  </b-th>
                  <b-th class="bg-info">
                    {{ last3MonthsLabels[1].toLocaleString() }}
                  </b-th>
                  <b-th class="bg-info">
                    {{ last3MonthsLabels[2].toLocaleString() }}
                  </b-th>
                  <b-th class="bg-info">
                    Total
                  </b-th>
                </b-tr>
              </b-thead>
              <b-tbody>
                <b-tr v-for="group in last3MonthsGroups" :key="group.id">
                  <b-td v-for="i in [0,1,2,3,4,5,6,7,8]" :key="group.id + '-' + i" :class="i < 5 ? 'bg-light' : 'bg-info'">
                    {{ group[i] }}
                  </b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
            <p v-if="someoverlap" class="text-muted small pl-1 mb-0">
              * The area for this Freegle community partly overlaps the area you're looking at, so we've added an appropriate percentage.
            </p>
          </b-col>
        </b-row>
      </div>
      <div v-else>
        <b-row class="m-0">
          <b-col cols="0" md="3" class="d-none d-md-block" />
          <b-col v-if="authority" cols="12" md="6" class="p-0">
            <div class="title pl-2">
              <b-img thumbnail src="/icon.png" class="titlelogo float-right" @click="toggle" />
              <span class="head">
                {{ authority.name }}
              </span>
              <div class="d-inline-block align-top pt-2">
                <date-picker
                  id="startDate"
                  v-model="startDate"
                  class="ml-1"
                  lang="en"
                  type="date"
                  append-to-body
                  format="YYYY-MM"
                  placeholder=""
                />
                <b>-</b>
                <date-picker
                  id="endDate"
                  v-model="endDate"
                  class=""
                  lang="en"
                  type="date"
                  append-to-body
                  format="YYYY-MM"
                  placeholder=""
                />
                <span class="clickme" @click="reloadData">
                  <v-icon name="sync" />
                </span>
              </div>
              <br>
              <v-icon name="globe-europe" /> www.iLoveFreegle.org  <v-icon name="brands/twitter" /> @thisisfreegle  <v-icon name="brands/facebook" /> facebook.com/Freegle
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
                <GroupMarker v-for="g in markers" :key="'marker-' + g.id + '-' + zoom" :group="g" />
              </l-map>
            </client-only>
            <Impact
              :total-weight="totalWeight"
              :total-benefit="totalBenefit"
              :total-c-o2="totalCO2"
              :total-gifts="totalGifts"
              :total-members="totalMembers"
              :group-count="groupcount "
              :range="range"
              :start="start"
              :end="end"
              border
            />
            <b-row class="m-0">
              <b-col class="border border-white p-0 bg-white text-center pt-1">
                <H5>WEIGHTS (KG)</H5>
              </b-col>
              <b-col class="border border-white p-0 bg-white text-center pt-1">
                <H5>MEMBERS</H5>
              </b-col>
            </b-row>
            <b-row class="m-0">
              <b-col class="border border-white p-0 bg-white overflow-hidden">
                <GChart
                  type="ColumnChart"
                  :data="weightData"
                  :options="weightOptions"
                />
              </b-col>
              <b-col class="border border-white p-0 bg-white overflow-hidden">
                <GChart
                  type="LineChart"
                  :data="memberData"
                  :options="memberOptions"
                />
              </b-col>
            </b-row>
            <b-card variant="white" class="border-white">
              <b-card-text>
                <h2 class="text-center">
                  Freegle Communities serving {{ authority.name }}
                </h2>
                <b-table striped :items="items" :fields="fields">
                  <template v-slot:cell(members)="data">
                    <!-- eslint-disable-next-line -->
                    <span v-html="data.value" />
                  </template>
                  <template v-slot:cell(monthly)="data">
                    <!-- eslint-disable-next-line -->
                    <span v-html="data.value" />
                  </template>
                </b-table>
                <p v-if="someoverlap" class="text-muted small pl-1 mb-0">
                  * The area for this Freegle community partly overlaps the area you're looking at, so we've added an appropriate percentage.
                </p>
              </b-card-text>
            </b-card>
            <b-row class="m-0">
              <b-col class="p-0">
                <div class="title pl-2">
                  <b-img thumbnail src="/icon.png" class="titlelogo float-right" />
                  <span class="head">
                    {{ totalWeight }} TONNES REUSED
                  </span>
                  <br>
                  <span class="small">
                    {{ range }}
                  </span>
                </div>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </div>
    </div>
    <b-row v-else>
      <b-col class="text-center">
        <h4>Crunching the numbers...</h4>
        <p>This may take a minute.</p>
        <b-img-lazy src="~/static/loader.gif" alt="Loading" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
// There are a bunch of icons we need only on this page.  By requiring them here we avoid
// requiring them in the vue-awesome plugin.  That makes them available everywhere - but
// increases the bundle size.  Putting them here allows better bundling.
import { GChart } from 'vue-google-charts'
import { TablePlugin } from 'bootstrap-vue'
import Vue from 'vue'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import Impact from '@/components/Impact'
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
import map from '@/mixins/map.js'

const GroupMarker = () => import('@/components/GroupMarker')

Vue.use(TablePlugin)

// Benefit of reuse per tonne is £711 and CO2 impact is -0.51tCO2eq based on WRAP figures.
// http://www.wrap.org.uk/content/monitoring-tools-and-resources
const BENEFIT_PER_TONNE = 711
const CO2_PER_TONNE = 0.51

export default {
  layout: 'empty',
  components: {
    GroupMarker,
    Impact,
    GChart,
    DatePicker
  },
  mixins: [loginOptional, buildHead, map],
  data() {
    return {
      tables: false,
      startDate: null,
      endDate: null,
      authority: null,
      stats: null,
      groupcount: null,
      // No animations as we want the SSR to return the whole thing.
      weightOptions: {
        interpolateNulls: false,
        legend: { position: 'none' },
        chartArea: { width: '80%', height: '80%' },
        bar: { groupWidth: '100%' },
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
      },
      fields: [
        {
          key: 'location',
          label: 'Community Location'
        },
        {
          key: 'members',
          label: 'Membership'
        },
        {
          key: 'monthly',
          label: 'Average Kgs Reused Monthly'
        }
      ]
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
      return this.totalWeight * BENEFIT_PER_TONNE
    },
    totalCO2() {
      return this.totalWeight * CO2_PER_TONNE
    },
    totalGifts() {
      let count = 0

      for (const groupid in this.stats) {
        const overlap = this.overlap(groupid)
        const stat = this.stats[groupid]
        const outcomes = stat.OutcomesPerMonth

        const start = this.$dayjs(this.startDate)
        const end = this.$dayjs(this.endDate)

        for (const outcome of outcomes) {
          const m = this.$dayjs(outcome.date + '-01')

          if (!m.isBefore(start) && !m.isAfter(end)) {
            count += outcome.count * overlap
          }
        }
      }

      return Math.round(count)
    },
    weightByMonth() {
      const bymonth = []

      for (const groupid in this.stats) {
        const overlap = this.overlap(groupid)
        const stat = this.stats[groupid]
        const weight = stat.Weights

        for (const a of weight) {
          const mon = a.date.substring(0, 7)

          if (!bymonth[mon]) {
            bymonth[mon] = 0
          }

          bymonth[mon] += a.count * overlap
        }
      }

      return bymonth
    },
    weightData() {
      const ret = [['Date', 'Count']]
      for (const mon in this.weightByMonth) {
        ret.push([new Date(mon + '-01'), this.weightByMonth[mon]])
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
      const start = this.$dayjs(this.startDate)
        .format('MMM YY')
        .toUpperCase()
      const end = this.$dayjs(this.endDate)
        .format('MMM YY')
        .toUpperCase()
      return start + ' - ' + end
    },
    monthsCovered() {
      const ret = this.$dayjs(this.endDate).diff(
        this.$dayjs(this.startDate),
        'months'
      )
      return ret + 1
    },
    end() {
      const end = this.$dayjs(this.endDate)
        .format('MMM YY')
        .toUpperCase()
      return end
    },
    someoverlap() {
      const groups = Object.values(this.stats)
      let someoverlaps = false

      for (const ix in groups) {
        const group = groups[ix]
        if (group.overlap < 1) {
          someoverlaps = true
        }
      }

      return someoverlaps
    },
    items() {
      const groups = Object.values(this.stats)
      groups.sort(function(a, b) {
        return b.avpermonth - a.avpermonth
      })

      const ret = []

      for (const ix in groups) {
        const group = groups[ix]

        if (group.ApprovedMemberCount.length > 0) {
          ret.push({
            location: group.group.namedisplay + (group.overlap < 1 ? ' *' : ''),
            members:
              Math.round(
                group.ApprovedMemberCount[group.ApprovedMemberCount.length - 1]
                  .count * group.overlap
              ).toLocaleString() +
              (group.overlap < 1
                ? ' (<span class="text-muted small">of ' +
                  Math.round(
                    group.ApprovedMemberCount[
                      group.ApprovedMemberCount.length - 1
                    ].count
                  ).toLocaleString() +
                  ')</span>'
                : ''),
            monthly:
              Math.round(group.avpermonth) +
              (group.overlap < 1
                ? ' (<span class="text-muted small">of ' +
                  Math.round(group.totalweight) +
                  ')</span>'
                : '')
          })
        }
      }

      return ret
    },
    markers() {
      const ret = []

      for (const groupid in this.stats) {
        ret.push(this.stats[groupid].group)
      }

      return ret
    },
    last3Months() {
      const now = this.$dayjs()
      const end = this.$dayjs(this.endDate)

      if (end.isSame(now, 'month')) {
        // We're in the current month.  Want to start from last month, as that is complete.
        return [
          now.subtract(3, 'month').startOf('month'),
          now.subtract(2, 'month').startOf('month'),
          now.subtract(1, 'month').startOf('month')
        ]
      } else {
        // Start from the supplied month.
        return [
          end.subtract(2, 'month').startOf('month'),
          end.subtract(1, 'month').startOf('month'),
          end.startOf('month')
        ]
      }
    },
    last3MonthsLabels() {
      return [
        this.last3Months[0].format('MMM-YY'),
        this.last3Months[1].format('MMM-YY'),
        this.last3Months[2].format('MMM-YY')
      ]
    },
    last3MonthsMembersTotal() {
      const ret = []

      this.memberData.forEach(data => {
        if (typeof data[0] !== 'string') {
          for (let mon = 2; mon >= 0; mon--) {
            // Need to use isSame(,'day') to handle DST.
            if (this.last3Months[mon].isSame(new this.$dayjs(data[0]), 'day')) {
              ret[mon] = data[1]
            }
          }
        }
      })

      return ret
    },
    last3MonthsUsersTotal() {
      if (!this.last3MonthsMembersTotal) {
        return [0, 0, 0]
      }

      // We use a systemwide average of 70.5%.
      const factor = 0.705

      return [
        Math.round(this.last3MonthsMembersTotal[0] * factor),
        Math.round(this.last3MonthsMembersTotal[1] * factor),
        Math.round(this.last3MonthsMembersTotal[2] * factor)
      ]
    },
    last3MonthsKgsTotal() {
      const ret = []

      for (const datamon in this.weightByMonth) {
        for (let mon = 2; mon >= 0; mon--) {
          if (this.last3Months[mon].format('YYYY-MM') === datamon) {
            ret[mon] = Math.round(this.weightByMonth[datamon])
          }
        }
      }

      return ret
    },
    last3MonthsBenefitTotal() {
      return [
        Math.round((this.last3MonthsKgsTotal[0] * BENEFIT_PER_TONNE) / 1000),
        Math.round((this.last3MonthsKgsTotal[1] * BENEFIT_PER_TONNE) / 1000),
        Math.round((this.last3MonthsKgsTotal[2] * BENEFIT_PER_TONNE) / 1000)
      ]
    },
    last3MonthsCO2Total() {
      return [
        Math.round((this.last3MonthsKgsTotal[0] * CO2_PER_TONNE) / 10) / 100,
        Math.round((this.last3MonthsKgsTotal[1] * CO2_PER_TONNE) / 10) / 100,
        Math.round((this.last3MonthsKgsTotal[2] * CO2_PER_TONNE) / 10) / 100
      ]
    },
    last3MonthsGiftsTotal() {
      const ret = []

      for (let mon = 2; mon >= 0; mon--) {
        let count = 0

        for (const groupid in this.stats) {
          const overlap = this.overlap(groupid)
          const stat = this.stats[groupid]
          const outcomes = stat.OutcomesPerMonth

          const start = this.last3Months[mon].startOf('month')
          const end = this.last3Months[mon].endOf('month')

          for (const outcome of outcomes) {
            const m = this.$dayjs(outcome.date + '-01')

            if (!m.isBefore(start) && !m.isAfter(end)) {
              count += outcome.count * overlap
            }
          }
        }

        ret[mon] = Math.round(count)
      }

      return ret
    },
    last3MonthsGroups() {
      const groups = Object.values(this.stats)
      groups.sort(function(a, b) {
        return a.group.namedisplay
          .toLowerCase()
          .localeCompare(b.group.namedisplay.toLowerCase())
      })

      const ret = []

      for (const ix in groups) {
        const group = groups[ix]
        const thisone = [
          group.group.namedisplay + (group.overlap < 1 ? ' *' : '')
        ]

        if (group.ApprovedMemberCount.length > 0) {
          for (let mon = 2; mon >= 0; mon--) {
            const end = this.last3Months[mon].endOf('month')
            for (let i = 0; i < group.ApprovedMemberCount.length; i++) {
              const thisdate = new this.$dayjs(
                group.ApprovedMemberCount[i].date
              ).endOf('day')

              // Sometimes there are gaps in data.  We know the stats are in ascending date order.  So just keep
              // overwriting so that we get the latest.
              if (end.format('YYYY-MMM') === thisdate.format('YYYY-MMM')) {
                thisone[mon + 1] = group.ApprovedMemberCount[i].count
              }
            }
          }

          thisone[4] = thisone[3] - thisone[1]

          for (let i = 1; i < 5; i++) {
            if (thisone[i]) {
              thisone[i] = thisone[i].toLocaleString()
            }
          }
        }

        if (group.Weights.length > 0) {
          for (let mon = 2; mon >= 0; mon--) {
            const end = this.last3Months[mon].endOf('month')
            thisone[mon + 5] = 0

            for (let i = 0; i < group.Weights.length; i++) {
              const thisdate = new this.$dayjs(
                group.ApprovedMemberCount[i].date
              ).endOf('day')

              if (end.format('YYYY-MMM') === thisdate.format('YYYY-MMM')) {
                thisone[mon + 5] += group.Weights[i].count
              }
            }
          }

          thisone[8] = thisone[5] + thisone[6] + thisone[7]

          for (let i = 5; i < 9; i++) {
            if (thisone[i]) {
              thisone[i] = thisone[i].toLocaleString()
            }
          }
        }

        ret.push(thisone)
      }

      return ret
    }
  },
  created() {
    this.id = this.$route.params.id

    // Default end is last complete month, and start is a year before that, so we cover twelve months.
    this.endDate = this.$dayjs()
      .subtract(1, 'month')
      .endOf('month')
      .format()
    this.startDate = this.$dayjs(this.endDate)
      .subtract(1, 'year')
      .add(1, 'month')
      .startOf('month')
      .format()
  },
  mounted() {
    this.fetchData(this.$store, this.id)
  },
  methods: {
    async fetchData(store, id) {
      await store.dispatch('authorities/fetch', {
        id: id
      })

      let groupcount = 0
      const stats = []

      const authority = store.getters['authorities/get'](id)

      // We only query in full months, and the server expects the end date to be exclusive.
      const start = this.$dayjs(this.startDate)
        .startOf('month')
        .format('YYYY-MM-DD')

      const end = this.$dayjs(this.endDate)
        .endOf('month')
        .add(1, 'day')
        .format('YYYY-MM-DD')

      for (const group of authority.groups) {
        await store.dispatch('stats/clear')
        await store.dispatch('stats/fetch', {
          group: group.id,
          grouptype: 'Freegle',
          start: start,
          end: end,
          force: true
        })

        // Check if the group has a significant overlap. No point cluttering things up with groups which don't really
        // contribute.
        const overlap = group.overlap
        const weights = store.getters['stats/get']('Weight')

        let totalWeight = 0
        for (const w of weights) {
          totalWeight += w.count * overlap
        }

        const avpermonth = totalWeight / this.monthsCovered

        // If there is only one group in the area we're looking at, or the group is entirely contained within the
        // area, then show it irrespective of activity otherwise it looks silly.
        if (avpermonth > 1 || authority.groups.length === 1 || overlap === 1) {
          groupcount++

          stats[group.id] = {
            overlap: overlap,
            avpermonth: avpermonth,
            totalweight: totalWeight,
            Weights: weights,
            ApprovedMemberCount: store.getters['stats/get'](
              'ApprovedMemberCount'
            ),
            OutcomesPerMonth: store.getters['stats/get']('OutcomesPerMonth'),
            group: group
          }
        }
      }

      this.authority = authority
      this.stats = stats
      this.groupcount = groupcount
    },
    overlap: function(groupid) {
      for (const group of this.authority.groups) {
        if (parseInt(group.id) === parseInt(groupid)) {
          return group.overlap
        }
      }

      return 0
    },
    idle() {
      if (!this.addedPolygons) {
        this.addedPolygons = true

        const bounds = this.mapPoly(this.authority.polygon, {
          fillColor: 'blue',
          weight: 0,
          fillOpacity: 0.2
        })

        this.$refs.map.mapObject.fitBounds(bounds)

        for (const groupid in this.stats) {
          const polygon = this.stats[groupid].group.poly

          this.mapPoly(polygon, {
            fillColor: 'grey',
            weight: 0,
            fillOpacity: 0.2
          })
        }
      }
    },
    reloadData() {
      if (
        this.startDate &&
        this.endDate &&
        this.$dayjs(this.endDate).isAfter(this.$dayjs(this.startDate))
      ) {
        this.stats = null
        this.fetchData(this.$store, this.id)
      }
    },
    toggle() {
      this.tables = !this.tables
    }
  },
  head() {
    return this.buildHead('Statistics', 'See stats and graphs for Freegle')
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.title {
  background-color: $color-green--darker;
  color: $color-white !important;
}

.titlelogo {
  width: 72px;
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
  color: $color-green--darker !important;
}

::v-deep .mx-datepicker {
  width: 100px;
}
</style>
