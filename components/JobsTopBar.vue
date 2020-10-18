<template>
  <div v-if="!simple && location" class="mb-2 jobbox bg-light overflow-hidden forcewrap">
    <NoticeMessage v-if="blocked" variant="warning">
      <h2 class="header--size3">
        Please help keep Freegle running
      </h2>
      <p>
        We normally show job ads here.  It looks like you may have an AdBlocker or security software which is blocking those.
        We're not mad on ads either, but please consider donating to help us keep going:
      </p>
      <donation-button />
    </NoticeMessage>
    <div v-else>
      <h2 class="sr-only">
        Jobs
      </h2>
      <div class="mb-1 text-center small text-muted">
        Jobs near you.  Freegle gets a <span class="d-none d-md-inline">small amount</span><span class="d-inline d-md-none">little</span> if you click<span class="d-none d-md-inline">, which helps keep us going</span>.  <nuxt-link to="/jobs">
          See more
          <!-- eslint-disable-next-line -->
        <span class="d-none d-md-inline">jobs</span></nuxt-link>.
      </div>
      <div v-for="(job, index) in jobs" :key="'job-' + job.onmousedown" class="">
        <Job :summary="true" :job="job" :class="index > 1 ? 'd-none d-md-block' : ''" />
      </div>
    </div>
  </div>
</template>

<script>
import Job from './Job'
import NoticeMessage from './NoticeMessage'
import DonationButton from './DonationButton'

export default {
  components: {
    NoticeMessage,
    Job,
    DonationButton
  },
  data: function() {
    return {
      location: null
    }
  },
  computed: {
    jobs() {
      let jobs = this.$store.getters['jobs/list']
      jobs = jobs.slice(0, 3)
      return jobs
    },
    blocked() {
      return this.$store.getters['jobs/blocked']
    }
  },
  mounted() {
    const me = this.$store.getters['auth/user']
    if (
      me &&
      me.settings &&
      me.settings.mylocation &&
      me.settings.mylocation.name
    ) {
      this.location = me.settings.mylocation.name
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
  methods: {}
}
</script>
