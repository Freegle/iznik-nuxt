<template>
  <div v-if="!simple && location" class="mb-2 jobbox bg-light overflow-hidden forcewrap" @click="maybeRecord">
    <NoticeMessage v-if="blocked" variant="warning" class="d-none">
      <h2 class="header--size3 d-none d-md-block">
        Please help keep Freegle running
      </h2>
      <p class="d-none d-md-block">
        We normally show job ads here.  It looks like you may have an AdBlocker or security software which is blocking those.
        We're not mad on ads either, but please consider donating to help us keep going:
      </p>
      <p class="d-block d-md-none">
        It looks like you're blocking job ads.  Please consider donating:
      </p>
      <donation-button />
    </NoticeMessage>
    <div v-else-if="jobs.length">
      <h2 class="sr-only">
        Jobs
      </h2>
      <div class="mb-1 text-center small text-muted">
        Jobs near you.  Freegle gets a <span class="d-none d-md-inline">small amount if you are interested and click</span><span class="d-inline d-md-none">little if you click</span><span class="d-none d-md-inline">, which helps keep us going</span>.
        <!-- eslint-disable-next-line -->
        <nuxt-link to="/jobs">See more<span class="d-none d-md-inline"> jobs</span></nuxt-link>.
      </div>
      <ul class="list-unstyled">
        <li v-for="(job, index) in jobs" :key="'job-' + job.job_reference">
          <Job :summary="true" :job="job" :class="index > 1 ? 'd-none d-md-block' : ''" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import jobs from '@/mixins/jobs'
const Job = () => import('./Job')
const NoticeMessage = () => import('./NoticeMessage')
const DonationButton = () => import('./DonationButton')

export default {
  components: {
    NoticeMessage,
    Job,
    DonationButton
  },
  mixins: [jobs],
  props: {
    shownLoveJunk: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      location: null
    }
  },
  computed: {
    jobs() {
      const jobs = this.$store.getters['jobs/list']
      return this.prioritise(jobs, 3)
    },
    blocked() {
      return this.$store.getters['jobs/blocked']
    }
  },
  watch: {
    shownLoveJunk: {
      handler(newVal) {
        if (newVal) {
          this.$api.bandit.shown({
            uid: 'jobs-love-junk',
            variant: 'topbar'
          })
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.myLocation) {
      this.location = this.myLocation.name
    }

    if (this.location) {
      // Delay a little bit to give the main pane a chance to load.
      setTimeout(() => {
        this.$store.dispatch('jobs/fetch', {
          location: this.location
        })
      }, 1000)
    }
  },
  methods: {
    async maybeRecord() {
      if (this.shownLoveJunk) {
        await this.$api.bandit.chosen({
          uid: 'jobs-love-junk',
          variant: 'topbar'
        })
      }
    }
  }
}
</script>
