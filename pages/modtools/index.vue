<template>
  <div v-if="me">
    <h2>Hello, {{ me.displayname }}</h2>
    <p>Here's your dashboard, where you can see what your communities have been doing recently.</p>
    <!-- eslint-disable-next-line -->
    <p>Need temporary help moderating?  Mail <a href="mailto:mentors@ilovefreegle.org">mentors@ilovefreegle.org</a>.</p>
    <p v-if="isApp">
      ModTools app version: {{ modtoolsVersion }}.
    </p>
    <ModMissingFacebook />
    <ModMissingTwitter class="mt-1" />
    <ModMissingProfile class="mt-1" />
    <div class="d-flex mb-2 mt-2 flex-wrap">
      <div class="borderit d-flex flex-column">
        <label for="dashboardgroup">Choose community:</label>
        <GroupSelect
          id="dashboardgroup"
          v-model="groupidi"
          all
          modonly
          :systemwide="admin"
          active
        />
      </div>
      <div class="borderit d-flex flex-column">
        <label for="showInfo">Show info from:</label>
        <b-select id="showInfo" v-model="showInfo">
          <option value="week">
            Last 7 days
          </option>
          <option value="month">
            The last month
          </option>
          <option value="year">
            The last 12 months
          </option>
          <option value="custom">
            Specific dates
          </option>
        </b-select>
      </div>
      <div v-if="showInfo === 'custom'" class="d-flex flex-wrap">
        <div class="borderit d-flex flex-column">
          <label for="startDate">From:</label>
          <date-picker id="startDate"
                       v-model="starti"
                       lang="en"
                       type="date"
                       format="YYYY-MM-DD"
                       :disabled-date="notbeforeepoch" />
        </div>
        <div class="borderit d-flex flex-column">
          <label for="endDate">To:</label>
          <date-picker id="endDate"
                       v-model="endi"
                       lang="en"
                       type="date"
                       format="YYYY-MM-DD"
                       :disabled-date="notbeforestart" />
        </div>
      </div>
      <div class="borderit d-flex flex-column justify-content-end">
        <b-btn variant="white" @click="update">
          <v-icon name="sync" /> Update
        </b-btn>
      </div>
    </div>
    <div v-if="start && end">
      <ModDashboardRecentCounts :groupid="groupid" :group-name="groupName" :start="start" :end="end" />
      <ModDashboardModeratorsActive :groupid="groupid" :group-name="groupName" :start="start" :end="end" />
      <ModDashboardPopularPosts :groupid="groupid" :group-name="groupName" :start="start" :end="end" class="mt-2" />
      <h2 class="mt-2">
        Active Freeglers <span class="text-muted">on {{ groupName }}</span>
      </h2>
      <p>These are the freeglers who've done most on the site recently.</p>
      <b-row>
        <b-col cols="12" xl="6">
          <ModDashboardFreeglersPosting :groupid="groupid" :group-name="groupName" :start="start" :end="end" />
        </b-col>
        <b-col cols="12" xl="6">
          <ModDashboardFreeglersReplying :groupid="groupid" :group-name="groupName" :start="start" :end="end" />
        </b-col>
      </b-row>
      <ModDashboardImpact :groupid="groupid" :start="start" :group-name="groupName" :end="end" class="mt-2" />
      <ActivityGraph
        :groupid="groupidi"
        :group-name="groupName"
        :start="start"
        :end="end"
        offers
        wanteds
        weights
        donations
        successful
        activeusers
        approvedmembers
        :systemwide="groupidi < 0"
      />
      <!--      TODO MT POSTLAUNCH TN vs email vs web stats-->
    </div>
  </div>
</template>
<style scoped>
</style>
<script>
import DatePicker from 'vue2-datepicker'
import lazyLoadComponent from '@/utils/lazy-load-component'
import loginRequired from '../../mixins/loginRequired'
import GroupSelect from '../../components/GroupSelect'
import 'vue2-datepicker/index.css'
import ModDashboardSkeleton from '../../components/ModDashboardSkeleton'
import ModMissingFacebook from '../../components/ModMissingFacebook'
import ModMissingTwitter from '../../components/ModMissingTwitter'
import ModMissingProfile from '../../components/ModMissingProfile'
import ActivityGraph from '../../components/ActivityGraph'
import ModDashboardImpact from '../../components/ModDashboardImpact'
const ExternalLink = () => import('~/components/ExternalLink')

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
    ModDashboardImpact,
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
    DatePicker,
    ExternalLink
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
  computed: {
    isApp() {
      return process.env.IS_APP
    },
    modtoolsVersion() {
      return process.env.MODTOOLS_VERSION
    },
    showInfo: {
      get() {
        return this.$store.getters['misc/get']('dashboardShowInfo') || 'week'
      },
      set(newValue) {
        this.$store.dispatch('misc/set', {
          key: 'dashboardShowInfo',
          value: newValue
        })
      }
    },
    groupName() {
      if (this.groupid < 0) {
        return 'all Freegle communities'
      } else if (!this.groupid) {
        return 'all my communities'
      } else {
        const group = this.$store.getters['group/get'](this.groupid)

        if (group) {
          return group.namedisplay
        } else {
          return ''
        }
      }
    }
  },
  watch: {
    showInfo() {
      this.update()
    },
    async groupid() {
      await this.$store.dispatch('group/fetch', {
        id: this.groupid
      })
    }
  },
  mounted() {
    console.log('MODTOOLS INDEX MOUNTED')
    this.update()
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
      switch (this.showInfo) {
        case 'week': {
          this.starti = this.$dayjs()
            .subtract(7, 'days')
            .toDate()
          this.endi = new Date()
          break
        }
        case 'month': {
          this.starti = this.$dayjs()
            .subtract(1, 'month')
            .toDate()
          this.endi = new Date()
          break
        }
        case 'year': {
          this.starti = this.$dayjs()
            .subtract(1, 'year')
            .toDate()
          this.endi = new Date()
          break
        }
        case 'custom': {
          // Do nothing - use the values in the input.
        }
      }

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
