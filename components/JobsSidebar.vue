<template>
  <div v-if="location" class="mt-2">
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
    <b-card v-else-if="jobs.length" variant="white" no-body>
      <b-card-body class="p-0">
        <b-btn variant="white" class="float-right m-1" size="sm" to="/jobs">
          <v-icon name="search" /> View more
        </b-btn>
        <nuxt-link to="/communityevents">
          <h4 class="pl-1 pt-1">
            <v-icon name="briefcase" scale="2" /> Jobs
          </h4>
        </nuxt-link>
        <p class="text-center small">
          Jobs near you.  Freegle gets a small amount if you click.
        </p>
        <div v-for="job in visibleJobs" :key="'job-' + job.onmousedown" class="">
          <Job :summary="true" :job="job" />
        </div>
        <client-only>
          <infinite-loading key="infinitejobs" @infinite="loadMore">
            <span slot="no-results">
              <notice-message v-if="!jobs || !jobs.length">
                We can't find any jobs at the moment.
              </notice-message>
            </span>
            <span slot="no-more" />
            <span slot="spinner" />
          </infinite-loading>
        </client-only>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import Job from './Job'
const NoticeMessage = () => import('~/components/NoticeMessage')

export default {
  components: {
    Job,
    NoticeMessage,
    InfiniteLoading
  },
  data: function() {
    return {
      location: null,
      show: 0
    }
  },
  computed: {
    jobs() {
      return this.$store.getters['jobs/list']
    },
    blocked() {
      return this.$store.getters['jobs/blocked']
    },
    visibleJobs() {
      if (process.browser) {
        // We have an infinite scroll - return as many as we're currently showing.
        return this.jobs.slice(0, this.show)
      } else {
        // SSR - return all for SEO.
        return this.job
      }
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
  methods: {
    loadMore($state) {
      // We use an infinite load for the list because it's a lot of DOM to add at initial page load.
      if (this.show < this.jobs.length) {
        this.show++
        $state.loaded()
      } else {
        $state.complete()
      }
    }
  }
}
</script>
