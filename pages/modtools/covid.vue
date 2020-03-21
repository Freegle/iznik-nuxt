<template>
  <div>
    <NoticeMessage variant="danger">
      This is an experimental and rapidly changing interface.  It will very soon be live - do not click buttons
      just to see what they do as this may affect real people.
    </NoticeMessage>
    <div v-if="mod">
      <div>
        <b-tabs content-class="mt-3" card>
          <b-tab active>
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                Summary
              </h2>
            </template>
            <div class="d-flex mb-2">
              <GroupSelect v-model="groupid" all />
              <b-btn variant="success" @click="loadit">
                Load data
              </b-btn>
            </div>
            <div v-if="loading">
              <b-img src="~/static/loader.gif" alt="Loading" />
            </div>
            <div v-else-if="loaded">
              <GChart
                type="PieChart"
                :data="replyData"
                :options="replyOptions"
                class="max"
              />
              <GChart
                type="PieChart"
                :data="statusData"
                :options="statusOptions"
                class="max"
              />
            </div>
          </b-tab>
          <b-tab id="needTab">
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                Need Help
              </h2>
            </template>
            <div v-if="needHelp && needHelp.length">
              <ModCovidUser v-for="covid in needHelp" :key="'needhelp-' + covid.id" :covidid="covid.id" />
            </div>
          </b-tab>
          <b-tab id="canTab">
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                Can Help
              </h2>
            </template>
            <div v-if="canHelp && canHelp.length">
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
      groupid: null
    }
  },
  computed: {
    covids() {
      const covids = Object.values(this.$store.getters['covid/list'])
      covids.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      })
      return covids
    },
    needCount() {
      return this.covids.filter(u => {
        return u.type === 'NeedHelp'
      }).length
    },
    canCount() {
      return this.covids.filter(u => {
        return u.type === 'CanHelp'
      }).length
    },
    closedCount() {
      return this.covids.filter(u => {
        return u.type === 'NeedHelp' && u.closed
      }).length
    },
    viewedCount() {
      return this.covids.filter(u => {
        return u.type === 'NeedHelp' && u.viewedown
      }).length
    },
    suggestedCount() {
      return this.covids.filter(u => {
        return (
          u.type === 'NeedHelp' && u.dispatched && !u.closed && !u.viewedown
        )
      }).length
    },
    pendingCount() {
      return this.covids.filter(u => {
        return u.type === 'NeedHelp' && !u.dispatched && !u.closed
      }).length
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
        ['Need Help (' + this.needCount + ')', this.needCount],
        ['Can Help (' + this.canCount + ')', this.canCount]
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
      return [
        ['Type', 'Count'],
        ['Closed (' + this.closedCount + ')', this.closedCount],
        ['Suggested (' + this.suggestedCount + ')', this.suggestedCount],
        ['Viewed (' + this.viewedCount + ')', this.viewedCount],
        ['Pending (' + this.pendingCount + ')', this.pendingCount]
      ]
    }
  },
  layout: 'modtools',
  methods: {
    async loadit() {
      this.loading = true

      await this.$store.dispatch('covid/fetchGroup', {
        groupid: this.groupid
      })

      this.loading = false
      this.loaded = true
      this.expanded = false
    }
  }
}
</script>
<style scoped>
.max {
  max-width: 320px;
}
</style>
