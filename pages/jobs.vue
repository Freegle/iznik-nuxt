<template>
  <div>
    <client-only>
      <b-row class="m-0">
        <b-col cols="0" md="3" class="d-none d-md-block" />
        <b-col cols="12" md="6" class="p-0">
          <h3>
            Jobs
            <span v-if="location">
              near {{ location }}
            </span>
          </h3>
          <NoticeMessage variant="info" class="mb-2">
            <p>
              Freegle will get a small amount if you click to view any of them, which will help keep us going.
            </p>
            <p>
              Some may ask you to sign up - sorry about that, it's not under our control.
            </p>
          </NoticeMessage>
          <div class="d-flex mb-2 flex-wrap justify-content-between">
            <PlaceAutocomplete class="mt-2" labeltext="Where are you looking?  Use a postcode or town name." @selected="search($event)" />
            <div class="mt-2 d-flex flex-column justify-content-end">
              <b-form-select v-model="category" :options="categories" size="lg" class="mt-md-4" />
            </div>
          </div>
          <div class="d-flex justify-content-around">
            <b-img-lazy v-if="loading && (!jobs || jobs.length === 0)" src="~/static/loader.gif" alt="Loading..." />
          </div>
          <div v-for="job in jobs" :key="'job-' + job.job_reference">
            <Job :job="job" class="mb-1" />
          </div>
          <NoticeMessage v-if="blocked" variant="warning">
            It looks like you may have an AdBlocker or security software which is blocking these job ads.
          </NoticeMessage>
          <div v-else-if="location && !loading && (!jobs || jobs.length === 0)">
            We didn't find any jobs here.  Please search somewhere else.
          </div>
        </b-col>
      </b-row>
    </client-only>
  </div>
</template>
<script>
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
import PlaceAutocomplete from '~/components/PlaceAutocomplete'
import NoticeMessage from '~/components/NoticeMessage'

const Job = () => import('~/components/Job')

export default {
  components: {
    PlaceAutocomplete,
    NoticeMessage,
    Job
  },
  mixins: [loginOptional, buildHead],
  data: function() {
    return {
      searchLocation: null,
      loading: true,
      category: null
    }
  },
  computed: {
    categories() {
      const ret = [
        {
          value: null,
          text: 'All job categories'
        }
      ]
      ;[
        'Accounting/Financial/Insurance',
        'Administration',
        'Agriculture',
        'Arts/Graphic Design',
        'Automotive/Aerospace',
        'Car',
        'Catering',
        'Charity',
        'Construction',
        'Consulting',
        'Customer Services',
        'Distribution',
        'Electronics',
        'Hospitality/Hotel',
        'IT',
        'Legal',
        'Leisure/Tourism',
        'Management',
        'Manufacturing/Surveying',
        'Marketing',
        'Media',
        'Medical/Pharmaceutical/Scientific',
        'Military/Emergency/Government',
        'Other',
        'Personnel/Recruitment',
        'Property Services',
        'Public Sector',
        'Retail/Purchasing',
        'Sales',
        'Social Care',
        'Telecoms'
      ].forEach(c => {
        ret.push({ value: c, text: c })
      })

      return ret
    },
    jobs() {
      return this.$store.getters['jobs/list']
    },
    blocked() {
      return this.$store.getters['jobs/blocked']
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
  watch: {
    category() {
      this.$nextTick(this.doSearch)
    }
  },
  mounted() {
    // We default to our own.
    if (this.me) {
      this.searchLat = this.me.lat
      this.searchLng = this.me.lng
      this.doSearch()
    }
  },
  beforeCreate() {
    this.suppliedLocation = this.$route.params.location
  },
  methods: {
    search(e) {
      if (e && (e.lat || e.lng)) {
        this.searchLat = e.lat
        this.searchLng = e.lng
        this.doSearch()
      }
    },
    async doSearch() {
      this.loading = true

      await this.$store.dispatch('jobs/clear')

      await this.$store.dispatch('jobs/fetch', {
        lat: this.searchLat,
        lng: this.searchLng,
        category: this.category,
        force: true
      })

      this.$nextTick(() => {
        this.loading = false
      })
    }
  },
  head() {
    return this.buildHead(
      'Jobs' + (this.location ? ' near ' + this.location : ''),
      'These are job ads fairly close to the location.  Freegle gets a little bit to help keep us going if you click on them.'
    )
  }
}
</script>
