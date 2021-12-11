<template>
  <div>
    <client-only>
      <ScrollToTop />
      <ModHelpMicrovolunteering />
      <GroupSelect v-model="groupid" modonly all remember="membersmicrovol" />

      <div v-if="busy" class="d-flex justify-content-around">
        <b-img-lazy src="~/static/loader.gif" alt="Loading" />
      </div>
      <div v-else-if="!groupid" class="mt-2">
        <NoticeMessage variant="warning">
          Please choose a community.
        </NoticeMessage>
      </div>
      <div v-else class="mt-2">
        <h2>Top Micro-volunteers</h2>
        <b-table-simple>
          <b-thead class="font-weight-bold">
            <b-tr>
              <b-th>ID</b-th>
              <b-th>Name</b-th>
              <b-th>Level</b-th>
              <b-th>Accuracy</b-th>
              <b-th>Micro-volunteering Activity</b-th>
              <b-th>Details</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr v-for="user in topUsers" :key="user.userid">
              <b-td>
                <nuxt-link :to="'/modtools/members/approved/search/' + groupid + '/' + user.userid">
                  <v-icon name="hashtag" scale="0.8" />{{ user.userid }}
                </nuxt-link>
              </b-td>
              <b-td>
                {{ userActivity[user.userid][0].user.displayname }}
              </b-td>
              <b-td>
                {{ userActivity[user.userid][0].user.trustlevel }}
              </b-td>
              <b-td>
                <div v-if="accuracyTotal(userActivity[user.userid]) === 0">
                  <span class="small text-muted">
                    No data
                  </span>
                </div>
                <div v-else>
                  {{ accuracyPercentage(userActivity[user.userid]) }}%
                  <span class="small text-muted">
                    from {{ accuracyTotal(userActivity[user.userid]) }}
                  </span>
                </div>
              </b-td>
              <b-td>
                <GChart
                  type="AreaChart"
                  :data="activityData(userActivity[user.userid])"
                  :options="activityOptions"
                  style="width: 300px; height: 100px;"
                />
              </b-td>
              <b-td>
                <ModMicrovolunteeringDetailsButton :user="userActivity[user.userid][0].user" :items="userActivity[user.userid]" />
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
      </div>
    </client-only>
  </div>
</template>
<script>
import loginRequired from '@/mixins/loginRequired'
import createGroupRoute from '@/mixins/createGroupRoute'
import { GChart } from 'vue-google-charts'
import { TablePlugin } from 'bootstrap-vue'
import Vue from 'vue'
import ScrollToTop from '~/components/ScrollToTop'
import ModHelpMicrovolunteering from '~/components/ModHelpMicrovolunteering'
import ModMicrovolunteeringDetailsButton from '~/components/ModMicrovolunteeringDetailsButton'
import GroupSelect from '~/components/GroupSelect'
import NoticeMessage from '~/components/NoticeMessage'

Vue.use(TablePlugin)

export default {
  components: {
    GroupSelect,
    ScrollToTop,
    ModHelpMicrovolunteering,
    NoticeMessage,
    GChart,
    ModMicrovolunteeringDetailsButton
  },
  layout: 'modtools',
  mixins: [
    loginRequired,
    createGroupRoute('modtools/members/microvolunteering')
  ],
  data() {
    return {
      busy: true
    }
  },
  computed: {
    activityOptions() {
      return {
        interpolateNulls: false,
        legend: { position: 'none' },
        vAxis: { viewWindow: { min: 0 } },
        hAxis: {
          format: 'MMM yyyy'
        },
        series: {
          0: { color: 'blue' }
        }
      }
    },
    items() {
      const items = Object.values(this.$store.getters['microvolunteering/list'])
      items.sort(function(a, b) {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      })

      return items
    },
    userCounts() {
      const ret = {}

      this.items.forEach(i => {
        if (i.user) {
          if (ret[i.user.id]) {
            ret[i.user.id]++
          } else {
            ret[i.user.id] = 1
          }
        }
      })

      const ret2 = []

      for (const r in ret) {
        if (ret[r]) {
          ret2.push({
            userid: r,
            count: ret[r]
          })
        }
      }

      ret2.sort(function(a, b) {
        return b.count - a.count
      })

      return ret2
    },
    topUsers() {
      return this.userCounts.slice(0, 10)
    },
    userActivity() {
      const ret = {}

      this.items.forEach(i => {
        if (i.user) {
          if (ret[i.user.id]) {
            ret[i.user.id].push(i)
          } else {
            ret[i.user.id] = [i]
          }
        }
      })

      return ret
    }
  },
  watch: {
    groupid(newVal) {
      this.fetch()
    }
  },
  mounted() {
    this.$store.dispatch('microvolunteering/clear')
    this.fetch()
  },
  methods: {
    async fetch() {
      this.busy = true

      if (this.groupid) {
        const start = this.$dayjs()
          .subtract(90, 'day')
          .format('YYYY-MM-DD')

        await this.$store.dispatch('microvolunteering/fetch', {
          list: true,
          groupid: this.groupid,
          limit: 10000,
          start: start
        })
      }

      this.busy = false
    },
    activityData(data) {
      const dates = []

      // Empty out the series so that we get data at each point.
      for (let i = 0; i <= 90; i++) {
        dates[
          this.$dayjs()
            .subtract(i, 'day')
            .format('YYYY-MM-DD')
        ] = 0
      }

      data.forEach(d => {
        const date = this.$dayjs(d.timestamp).format('YYYY-MM-DD')

        if (!dates[date]) {
          dates[date] = 0
        }

        dates[date]++
      })

      const ret = [['Date', 'Count']]

      for (const date in dates) {
        ret.push([new Date(date), dates[date]])
      }

      return ret
    },
    accuracy(data) {
      let right = 0
      let wrong = 0

      data.forEach(d => {
        if (d.score_positive) {
          right++
        } else if (d.score_negative) {
          wrong++
        }
      })

      return [right, wrong]
    },
    accuracyPercentage(data) {
      const score = this.accuracy(data)
      return Math.round((100 * score[0]) / (score[0] + score[1]))
    },
    accuracyTotal(data) {
      const score = this.accuracy(data)
      return score[0] + score[1]
    }
  }
}
</script>
<style scoped>
select {
  max-width: 300px;
}
</style>
