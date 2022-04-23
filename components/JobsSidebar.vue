<template>
  <aside v-if="location" @click="maybeRecord">
    <NoticeMessage v-if="blocked" variant="warning" class="d-none">
      <h3>Please help keep Freegle running</h3>
      <p>
        We normally show job ads here.  It looks like you may have an AdBlocker or security software which is blocking those.
        We're not mad on ads either, but please consider donating to help us keep going:
      </p>
      <donation-button />
    </NoticeMessage>
    <b-card v-else-if="jobs.length" variant="white" no-body>
      <b-card-body class="p-0">
        <nuxt-link to="/jobs">
          <h2 class="header--size4 pl-1 pt-1">
            <v-icon name="briefcase" scale="2" /> Jobs near you
          </h2>
        </nuxt-link>
        <p class="text-center small">
          Freegle gets a small amount if you are interested and click.
        </p>
        <ul class="list-unstyled">
          <li v-for="job in visibleJobs" :key="'job-' + job.job_reference">
            <Job :summary="true" :job="job" />
          </li>
        </ul>
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
        <div class="d-flex justify-content-around mt-2 mb-2">
          <b-btn variant="secondary" to="/jobs">
            <v-icon name="search" /> View more jobs
          </b-btn>
        </div>
      </b-card-body>
    </b-card>
  </aside>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import jobs from '@/mixins/jobs'
import Job from './Job'
const NoticeMessage = () => import('~/components/NoticeMessage')
const DonationButton = () => import('~/components/DonationButton')

export default {
  components: {
    Job,
    NoticeMessage,
    InfiniteLoading,
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
        //
        // Don't prioritise otherwise this makes them jump around when scrolling down.
        return this.jobs.slice(0, this.show)
      } else {
        // SSR - return all for SEO.
        return this.job
      }
    }
  },
  watch: {
    shownLoveJunk: {
      handler(newVal) {
        if (newVal) {
          this.$api.bandit.shown({
            uid: 'jobs-love-junk',
            variant: 'sidebar'
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
    loadMore($state) {
      // We use an infinite load for the list because it's a lot of DOM to add at initial page load.  Can't step up
      // one at a time though, as we trigger an infinite loop test in the plugin.
      if (this.show < this.jobs.length) {
        this.show += 3
        $state.loaded()
      } else {
        $state.complete()
      }
    },
    async maybeRecord() {
      if (this.shownLoveJunk) {
        await this.$api.bandit.chosen({
          uid: 'jobs-love-junk',
          variant: 'sidebar'
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
aside {
  height: 100%;
  overflow-y: scroll;
  scrollbar-gutter: stable;
}
</style>
