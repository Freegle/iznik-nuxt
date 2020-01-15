<template>
  <div>
    <div v-if="summary" class="ml-2 mr-2">
      <h6>
        {{ job.title }}
        <nuxt-link :to="'/job/' + job.id" class="float-right">
          Read more <v-icon name="angle-double-right" />
        </nuxt-link>
      </h6>
      <p class="text-truncate mt-2">
        {{ job.snippet }}
      </p>
    </div>
    <b-card v-else no-body variant="info" :class="highlight ? 'job-row bg-info': 'job-row'">
      <b-card-body class="job-row">
        <b-card-title class="job-title">
          {{ job.title }}
        </b-card-title>
        <b-card-sub-title v-if="job.location || job.postcode">
          <span v-if="job.location" class="location">
            {{ job.location }}
          </span>
          <span v-if="job.location && job.postcode">
            -
          </span>
          <span v-if="job.postcode" class="postcode">
            {{ job.postcode }}
          </span>
          <span v-if="job.salary" class="float-right salary">
            {{ job.salary }}
          </span>
        </b-card-sub-title>
        <b-row>
          <b-col>
            <div class="media clickme">
              <div class="media-left" />
              <div class="media-body w-100">
                <p class="text-truncate mt-2 job-description">
                  {{ job.snippet }}
                </p>
              </div>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <!-- eslint-disable-next-line -->
            <span v-html="joblink" />
            <div v-if="job.logo" class="media-object">
              <b-img
                class="float-right"
                :src="job.logo"
                @error.native="brokenImage"
              />
            </div>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>
<style scoped lang="scss">
</style>
<script>
export default {
  props: {
    job: {
      type: Object,
      required: true
    },
    summary: {
      type: Boolean,
      required: false,
      default: false
    },
    highlight: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    joblink() {
      return (
        '<a target="_blank" class="float-left btn btn-info" ' +
        'onmousedown="' +
        this.job.onmousedown +
        '" ' +
        'href="' +
        this.job.url +
        '">More info &gt;</a>'
      )
    }
  },
  methods: {
    fire(e) {
      // We have to fire the pnpClick here - we can't insert it into the template because it gets escaped.
      const tag = this.job.onmousedown.match(/'(.*)'/)

      if (tag && tag.length > 1) {
        // We create an URL like the pnpClick function does.
        const url = this.job.url + '&psd=' + tag[1]
        console.log('Open', url)
        window.open(url, '_blank')

        e.preventDefault()
      }
    }
  }
}
</script>
