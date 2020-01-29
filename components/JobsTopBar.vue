<template>
  <div v-if="location" class="mb-2 bg-light">
    <NoticeMessage v-if="blocked" variant="warning">
      <h3>Please help keep Freegle running</h3>
      <p>
        We normally show job ads here.  It looks like you may have an AdBlocker or security software which is blocking those.
        We're not mad on ads either, but please consider donating to help us keep going:
      </p>
      <a href="https://freegle.in/paypalfundraiser" target="_blank">
        <b-btn variant="primary" size="lg">
          <b-img thumbnail alt="PayPal" src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" />
          &nbsp;Donate
        </b-btn>
      </a>
    </NoticeMessage>
    <div v-else class="jobbox overflow-hidden">
      <div class="mb-1 text-center small text-muted">
        Jobs near you.  Freegle gets a small amount if you click, which helps keep us going.  <nuxt-link to="/jobs">
          See more jobs
        </nuxt-link>.
      </div>
      <div v-for="job in jobs" :key="'job-' + job.onmousedown" class="">
        <Job :summary="true" :job="job" />
      </div>
    </div>
  </div>
</template>

<script>
import Job from './Job'
import NoticeMessage from './NoticeMessage'

export default {
  components: {
    NoticeMessage,
    Job
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

<style scoped>
.jobbox {
  height: 220px;
}
</style>
