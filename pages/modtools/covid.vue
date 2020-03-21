<template>
  <div>
    <NoticeMessage variant="danger">
      This is an experimental and rapidly changing interface.  It will very soon be live - do not click buttons
      just to see what they do as this may affect real people.
    </NoticeMessage>
    <div v-if="mod">
      <div>
        <b-tabs v-model="tabIndex" content-class="mt-3" card>
          <b-tab active>
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                Summary
              </h2>
            </template>
            <p>All My Communities includes groups you're a backup mod on.</p>
            <div class="d-flex mb-2">
              <GroupSelect v-model="groupid" all :systemwide="supportOrAdmin" />
            </div>
            <div v-if="counts">
              <GChart
                type="PieChart"
                :data="replyData"
                :options="replyOptions"
                class="chart"
              />
              <GChart
                type="PieChart"
                :data="statusData"
                :options="statusOptions"
                class="chart"
              />
            </div>
          </b-tab>
          <b-tab id="needTab">
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                Need Help
              </h2>
            </template>
            <div v-if="loading">
              <b-img src="~/static/loader.gif" alt="Loading" />
            </div>
            <div v-else-if="needHelp && needHelp.length">
              <ModCovidUser v-for="covid in needHelp" :key="'needhelp-' + covid.id" :covidid="covid.id" />
            </div>
          </b-tab>
          <b-tab id="canTab">
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                Can Help
              </h2>
            </template>
            <div v-if="loading">
              <b-img src="~/static/loader.gif" alt="Loading" />
            </div>
            <div v-else-if="canHelp && canHelp.length">
              <ModCovidUser v-for="covid in canHelp" :key="'canhelp-' + covid.id" :covidid="covid.id" />
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import { GChart } from 'vue-google-charts'
import ModCovidUser from '../../components/ModCovidUser'
import GroupSelect from '../../components/GroupSelect'
import NoticeMessage from '../../components/NoticeMessage'
import loginRequired from '@/mixins/loginRequired.js'

export default {
  components: { NoticeMessage, GroupSelect, ModCovidUser, GChart },
  mixins: [loginRequired],
  data: function() {
    return {
      loading: false,
      loaded: false,
      groupid: null,
      tabIndex: 0
    }
  },
  computed: {
    counts() {
      return this.$store.getters['covid/counts']
    },
    covids() {
      const covids = Object.values(this.$store.getters['covid/list'])
      covids.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      })
      return covids
    },
    needHelp() {
      return this.covids
        .filter(u => {
          return u.type === 'NeedHelp' && !u.closed
        })
        .sort((a, b) => {
          if (a.dispatched && !b.dispatched) {
            return 1
          } else if (!a.dispatched && b.dispatched) {
            return -1
          } else {
            return (
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )
          }
        })
    },
    visibleNeed() {
      return this.needHelp.slice(0, this.showNeed)
    },
    canHelp() {
      return this.covids.filter(u => {
        return u.type === 'CanHelp' && !u.closed
      })
    },
    visibleCan() {
      return this.needHelp.slice(0, this.showCan)
    },
    replyOptions() {
      return {
        title: this.covids.length + ' Replies',
        chartArea: { width: '200px', height: '200px' },
        slices: {
          1: { color: 'green' },
          0: { color: 'blue' }
        }
      }
    },
    replyData() {
      return [
        ['Type', 'Count'],
        ['Need Help (' + this.counts.NeedHelp + ')', this.counts.NeedHelp],
        ['Can Help (' + this.counts.CanHelp + ')', this.counts.CanHelp]
      ]
    },
    statusOptions() {
      return {
        title: 'Help Request Status',
        chartArea: { width: '200px', height: '200px' },
        slices: {
          0: { color: 'grey' },
          1: { color: 'lightgreen' },
          2: { color: 'green' },
          3: { color: 'orange' }
        }
      }
    },
    statusData() {
      const pending =
        this.counts.NeedHelp -
        this.counts.closed -
        this.counts.dispatched -
        this.counts.viewedown

      return [
        ['Type', 'Count'],
        ['Closed (' + this.counts.closed + ')', this.counts.closed],
        ['Suggested (' + this.counts.dispatched + ')', this.counts.dispatched],
        ['Viewed (' + this.counts.viewedown + ')', this.counts.viewedown],
        ['Pending (' + pending + ')', pending]
      ]
    }
  },
  watch: {
    groupid() {
      this.fetchCounts()
    },
    tabIndex(newVal) {
      console.log('Tab now', newVal)

      if (newVal === 1) {
        this.fetchData('NeedHelp')
      } else if (newVal === 2) {
        this.fetchData('CanHelp')
      }
    }
  },
  mounted() {
    this.fetchCounts()
  },
  layout: 'modtools',
  methods: {
    async fetchData(type) {
      this.loading = true

      await this.$store.dispatch('covid/fetchGroup', {
        groupid: this.groupid,
        helptype: type
      })

      this.loading = false
      this.loaded = true
      this.expanded = false
    },
    async fetchCounts() {
      await this.$store.dispatch('covid/counts', {
        groupid: this.groupid
      })
    }
  }
}
</script>
<style scoped>
.max {
  max-width: 320px;
}

.chart {
  max-width: 400px;
}
</style>
