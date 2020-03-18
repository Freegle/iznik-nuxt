<template>
  <div>
    <div v-if="mod">
      <div>
        <b-tabs content-class="mt-3" card>
          <b-tab active>
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                Summary
              </h2>
            </template>
            <div v-if="loading">
              <b-img src="~/static/loader.gif" alt="Loading" />
            </div>
            <div v-else>
              <GChart
                type="PieChart"
                :data="replyData"
                :options="replyOptions"
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
              <ModCovidUser v-for="user in needHelp" :key="user.id" :user="user" />
            </div>
          </b-tab>
          <b-tab id="canTab">
            <template v-slot:title>
              <h2 class="ml-2 mr-2">
                Can Help
              </h2>
            </template>
            <div v-if="canHelp && canHelp.length">
              <ModCovidUser v-for="user in canHelp" :key="'needhelp-' + user.id" :user="user">
                {{ user.id }}
              </ModCovidUser>
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
import loginRequired from '@/mixins/loginRequired.js'

export default {
  components: { ModCovidUser, GChart },
  mixins: [loginRequired],
  data: function() {
    return {
      users: [],
      loading: true
    }
  },
  computed: {
    needCount() {
      return this.users.filter(u => {
        return u.covid.type === 'NeedHelp'
      }).length
    },
    canCount() {
      return this.users.filter(u => {
        return u.covid.type === 'CanHelp'
      }).length
    },
    needHelp() {
      return this.users.filter(u => {
        return u.covid.type === 'NeedHelp' && !u.covid.closed
      })
    },
    visibleNeed() {
      return this.needHelp.slice(0, this.showNeed)
    },
    canHelp() {
      return this.users.filter(u => {
        return u.covid.type === 'CanHelp' && !u.covid.closed
      })
    },
    visibleCan() {
      return this.needHelp.slice(0, this.showCan)
    },
    replyOptions() {
      return {
        title: this.users.length + ' Replies',
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
    }
  },
  layout: 'modtools',
  async mounted() {
    const ret = await this.$api.covid.fetch()
    this.users = Object.values(ret)
    this.loading = false
  }
}
</script>
<style scoped>
.max {
  max-width: 320px;
}
</style>
