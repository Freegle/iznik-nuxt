<template>
  <div class="mt-2">
    <b-card v-if="jobs.length" variant="white" no-body>
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
        <div v-for="job in jobs" :key="'job-' + job.onmousedown" class="">
          <Job :summary="true" :job="job" />
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
import 'vue-awesome/icons/briefcase'
import 'vue-awesome/icons/search'
// TODO DESIGN This sidebar is slow to appear, because the data comes from a third party website.  Should we have
// a slide transition or something to make its appearance less disruptive?
import Job from './Job'

export default {
  components: {
    Job
  },
  data: function() {
    return {}
  },
  computed: {
    jobs() {
      return this.$store.getters['jobs/list']
    }
  },
  mounted() {
    this.$store.dispatch('jobs/clear')

    const me = this.$store.getters['auth/user']
    let location = null

    if (
      me &&
      me.settings &&
      me.settings.mylocation &&
      me.settings.mylocation.name
    ) {
      location = me.settings.mylocation.name
    }

    // Delay a little bit to give the main pane a chance to load.
    setTimeout(() => {
      this.$store.dispatch('jobs/fetch', {
        location: location
      })
    }, 1000)
  },
  methods: {}
}
</script>
