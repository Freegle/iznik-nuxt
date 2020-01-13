<template>
  <div>
    <b-row class="m-0">
      <b-col cols="0" md="3" class="d-none d-md-block" />
      <b-col cols="12" md="6" class="p-0">
        <h3>
          Jobs
          <span v-if="location">
            near {{ location }}
          </span>
        </h3>
        <p>
          These are jobs
          <span v-if="location">
            near {{ location }},
          </span>
          which you might be interested in.
        </p>
        <p>
          Freegle will get a small amount if you click to view any of them, which will help keep us going.
        </p>
        <b-input-group class="flex mb-2">
          <b-form-input
            v-model="searchLocation"
            size="lg"
            type="text"
            placeholder="Where are you looking?  Use a postcode or town name"
          />
          <b-input-group-append>
            <b-button variant="success" size="lg" @click="search">
              <v-icon name="search" />&nbsp;Search
            </b-button>
          </b-input-group-append>
        </b-input-group>

        <b-img-lazy v-if="loading && (!jobs || jobs.length === 0)" src="~/static/loader.gif" alt="Loading..." />
        <div v-for="job in jobs" :key="'job-' + job.onmousedown">
          <Job :job="job" class="mb-1" :highlight="job.id === id" />
        </div>
        <div v-if="!loading && (!jobs || jobs.length === 0)">
          We didn't find any jobs here.  Please search somewhere else.
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<style scoped>
</style>
<script>
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
const Job = () => import('~/components/Job')

export default {
  components: {
    Job
  },
  mixins: [loginOptional, buildHead],
  data: function() {
    return {
      loading: true,
      searchLocation: null
    }
  },
  computed: {
    jobs() {
      // Key difference from _location - move the job we're interested in to the start of the queue.
      const ret = this.$store.getters['jobs/list']

      for (let i = 0; i < ret.length; i++) {
        if (ret[i].id === this.id) {
          const found = ret.splice(i, 1)
          ret.unshift(found[0])
        }
      }

      return ret
    },
    location() {
      let ret = null

      if (this.suppliedLocation) {
        ret = this.suppliedLocation
      } else {
        const me = this.$store.getters['auth/user']

        if (
          me &&
          me.settings &&
          me.settings.mylocation &&
          me.settings.mylocation.name
        ) {
          ret = me.settings.mylocation.name
        }
      }

      return ret
    }
  },
  async mounted() {
    // Don't clear store - that means if we saw a job in the sidebar, then it will still be present.
    const ret = this.$store.getters['jobs/list']

    let found = false

    for (let i = 0; i < ret.length; i++) {
      if (ret[i].id === this.id) {
        found = true
      }
    }

    if (!found) {
      // We didn't find the job we wanted.  Perhaps our store is empty or out of date.
      await this.$store.dispatch('jobs/fetch', {
        location: this.location
      })
    }

    this.loading = false
  },
  beforeCreate() {
    this.id = this.$route.params.id
  },
  methods: {
    search() {
      this.$router.push('/jobs/' + encodeURIComponent(this.searchLocation))
    }
  },
  head() {
    return this.buildHead(
      this.location ? 'Jobs near ' + this.location : 'Jobs',
      'These are job ads fairly close to the location.  Freegle gets a little bit to help keep us going if you click on them.'
    )
  }
}
</script>
