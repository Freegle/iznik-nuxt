<template>
  <div>
    <h2>Hello, {{ me.displayname }}</h2>
    <p>Here's your dashboard, where you can see what your communities have been doing recently.</p>
    <div class="d-flex mb-2 mt-2">
      <div class="borderit d-flex flex-column">
        <label for="dashboardgroup">Choose community:</label>
        <GroupSelect id="dashboardgroup" v-model="groupid" all modonly />
      </div>
      <div class="borderit d-flex flex-column">
        <label for="startDate" class="date__label">From:</label>
        <date-picker
          id="startDate"
          v-model="start"
          lang="en"
          type="date"
          format="YYYY-MM-DD"
        />
      </div>
      <div class="borderit d-flex flex-column">
        <label for="endDate" class="date__label">To:</label>
        <date-picker
          id="endDate"
          v-model="end"
          lang="en"
          type="date"
          format="YYYY-MM-DD"
        />
      </div>
    </div>
    <div v-if="start && end">
      <ModDashboardRecentCounts :groupid="groupid" :start="start" :end="end" />
      <ModDashboardModeratorsActive :groupid="groupid" :start="start" :end="end" />
      <ModDashboardPopularPosts :groupid="groupid" :start="start" :end="end" class="mt-2" />
      <h2 class="mt-2">
        Active Freeglers
      </h2>
      <p>These are the freeglers who've done most on the site recently.</p>
      <b-row>
        <b-col cols="12" xl="6">
          <ModDashboardFreeglersPosting :groupid="groupid" :start="start" :end="end" />
        </b-col>
        <b-col cols="12" xl="6">
          <ModDashboardFreeglersReplying :groupid="groupid" :start="start" :end="end" />
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<style scoped>
</style>
<script>
import DatePicker from 'vue2-datepicker'
import loginRequired from '../../mixins/loginRequired'
import ModDashboardRecentCounts from '../../components/ModDashboardRecentCounts'
import GroupSelect from '../../components/GroupSelect'
import 'vue2-datepicker/index.css'
import ModDashboardPopularPosts from '../../components/ModDashboardPopularPosts'
import ModDashboardFreeglersPosting from '../../components/ModDashboardFreeglersPosting'
import ModDashboardFreeglersReplying from '../../components/ModDashboardFreeglersReplying'
import ModDashboardModeratorsActive from '../../components/ModDashboardModeratorsActive'

export default {
  components: {
    ModDashboardModeratorsActive,
    ModDashboardFreeglersReplying,
    ModDashboardFreeglersPosting,
    ModDashboardPopularPosts,
    GroupSelect,
    ModDashboardRecentCounts,
    DatePicker
  },
  layout: 'modtools',
  mixins: [loginRequired],
  data: function() {
    return {
      groupid: null,
      start: null,
      end: null,
      dateFormat: null
    }
  },
  computed: {},
  mounted() {
    this.start = this.$dayjs()
      .subtract(7, 'days')
      .toDate()
    this.end = new Date()
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.borderit {
  border: 1px solid $color-green--lighter;
  border-radius: 0.25rem;
  padding: 5px;
}
</style>
