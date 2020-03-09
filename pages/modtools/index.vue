<template>
  <div>
    <h2>Hello, {{ me.displayname }}</h2>
    <p>Here's your dashboard, where you can see what your communities have been doing recently.</p>
    <ModMissingFacebook />
    <ModMissingTwitter class="mt-1" />
    <ModMissingProfile class="mt-1" />
    <div class="d-flex mb-2 mt-2">
      <div class="borderit d-flex flex-column">
        <label for="dashboardgroup">Choose community:</label>
        <GroupSelect id="dashboardgroup" v-model="groupidi" all modonly active />
      </div>
      <div class="borderit d-flex flex-column">
        <label for="startDate">From:</label>
        <date-picker
          id="startDate"
          v-model="starti"
          lang="en"
          type="date"
          format="YYYY-MM-DD"
          :disabled-date="notbeforeepoch"
        />
      </div>
      <div class="borderit d-flex flex-column">
        <label for="endDate">To:</label>
        <date-picker
          id="endDate"
          v-model="endi"
          lang="en"
          type="date"
          format="YYYY-MM-DD"
          :disabled-date="notbeforestart"
        />
      </div>
      <div class="borderit d-flex flex-column justify-content-end">
        <b-btn variant="white" @click="update">
          <v-icon name="sync" /> Update
        </b-btn>
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
      <ActivityGraph :groupid="groupid" :start="start" :end="end" offers wanteds />
    </div>
  </div>
</template>
<style scoped>
</style>
<script>
import DatePicker from 'vue2-datepicker'
import loginRequired from '../../mixins/loginRequired'
import GroupSelect from '../../components/GroupSelect'
import 'vue2-datepicker/index.css'
import ModDashboardSkeleton from '../../components/ModDashboardSkeleton'
import ModMissingFacebook from '../../components/ModMissingFacebook'
import ModMissingTwitter from '../../components/ModMissingTwitter'
import ModMissingProfile from '../../components/ModMissingProfile'
import ActivityGraph from '../../components/ActivityGraph'
import lazyLoadComponent from '@/utils/lazy-load-component'

// We lazy load these components below, but by importing them here it means they can render their own
// loading indicators rather than using the lazyload text.
// import('@/components/ModDashboardRecentCounts.vue')
// import('@/components/ModDashboardPopularPosts.vue')
// import('@/components/ModDashboardModeratorsActive.vue')
// import('@/components/ModDashboardFreeglersReplying.vue')
// import('@/components/ModDashboardFreeglersPosting.vue')

export default {
  // We use a lazy-loading trick from https://markus.oberlehner.net/blog/lazy-load-vue-components-when-they-become-visible/.
  // This avoids hitting the server with expensive calls if people don't scroll down.
  components: {
    ActivityGraph,
    ModMissingProfile,
    ModMissingTwitter,
    ModMissingFacebook,
    GroupSelect,
    ModDashboardRecentCounts: lazyLoadComponent({
      componentFactory: () =>
        import('@/components/ModDashboardRecentCounts.vue'),
      loading: ModDashboardSkeleton
    }),
    ModDashboardPopularPosts: lazyLoadComponent({
      componentFactory: () =>
        import('@/components/ModDashboardPopularPosts.vue'),
      loading: ModDashboardSkeleton
    }),
    ModDashboardModeratorsActive: lazyLoadComponent({
      componentFactory: () =>
        import('@/components/ModDashboardModeratorsActive.vue'),
      loading: ModDashboardSkeleton
    }),
    ModDashboardFreeglersReplying: lazyLoadComponent({
      componentFactory: () =>
        import('@/components/ModDashboardFreeglersReplying.vue'),
      loading: ModDashboardSkeleton
    }),
    ModDashboardFreeglersPosting: lazyLoadComponent({
      componentFactory: () =>
        import('@/components/ModDashboardFreeglersPosting.vue'),
      loading: ModDashboardSkeleton
    }),
    DatePicker
  },
  layout: 'modtools',
  mixins: [loginRequired],
  data: function() {
    return {
      groupid: null,
      groupidi: null,
      starti: null,
      endi: null,
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
    this.starti = this.start
    this.endi = this.end
  },
  methods: {
    notbeforeepoch(date) {
      // We only have stats back to this point.
      return !this.$dayjs(date).isSameOrAfter(this.$dayjs('2015-08-24'))
    },
    notbeforestart(date) {
      const d = this.$dayjs(date)
      const now = this.$dayjs()

      return d.isAfter(now) || !d.isAfter(this.$dayjs(this.starti))
    },
    update() {
      // A manual click to do the refresh avoids multiple refreshes when tweaking dates.
      this.start = this.starti
      this.end = this.endi
      this.groupid = this.groupidi
    }
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
