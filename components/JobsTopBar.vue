<template>
  <div class="mb-2 jobbox bg-light overflow-hidden">
    <div class="mb-1 text-center small text-muted">
      Jobs near you.  Freegle gets a small amount if you click, which helps keep us going.  <nuxt-link to="/jobs">
        See more
      </nuxt-link>.
    </div>
    <div v-for="job in jobs" :key="'job-' + job.onmousedown" class="">
      <Job :summary="true" :job="job" />
    </div>
  </div>
</template>
<style scoped>
.jobbox {
  height: 220px;
}
</style>
<script>
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
      let jobs = this.$store.getters['jobs/list']
      jobs = jobs.slice(0, 3)
      return jobs
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
