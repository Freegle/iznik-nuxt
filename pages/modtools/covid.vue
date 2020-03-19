<template>
  <div>
    <NoticeMessage variant="danger">
      This is an experimental and rapidly changing interface.  You can view things, but please don't start actively
      using it without talking to Edward first.  We are not ready to do that generally and could get ourselves in
      a fankle.
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
              <GroupSelect v-model="groupid" all :systemwide="supportOrAdmin" />
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
import GroupSelect from '../../components/GroupSelect'
import NoticeMessage from '../../components/NoticeMessage'
import loginRequired from '@/mixins/loginRequired.js'

export default {
  components: { NoticeMessage, GroupSelect, ModCovidUser, GChart },
  mixins: [loginRequired],
  data: function() {
    return {
      users: [],
      loading: false,
      loaded: false,
      groupid: null
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
  methods: {
    async loadit() {
      this.loading = true

      const ret = await this.$api.covid.fetch(this.groupid)
      this.users = Object.values(ret).sort((a, b) => {
        return (
          new Date(b.covid.timestamp).getTime() -
          new Date(a.covid.timestamp).getTime()
        )
      })

      this.loading = false
      this.loaded = true
    }
  }
}
</script>
<style scoped>
.max {
  max-width: 320px;
}
</style>
