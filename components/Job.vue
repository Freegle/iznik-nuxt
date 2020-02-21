<template>
  <div @click="clicked">
    <div v-if="summary" class="ml-2 mr-2">
      <h6>
        <!-- eslint-disable-next-line -->
        <span v-html="joblinksumm" />
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
      // AdView expects links in a particular format, which invoke its own onmouse down, and so we have to put the
      // raw HTML in there via v-html.
      return (
        '<a target="_blank" class="float-left btn btn-info" ' +
        'onmousedown="' +
        this.job.onmousedown +
        '" ' +
        'href="' +
        this.job.url +
        '">More info &gt;</a>'
      )
    },
    joblinksumm() {
      // AdView expects links in a particular format, which invoke its own onmouse down, and so we have to put the
      // raw HTML in there via v-html.
      return (
        '<a target="_blank" class="" ' +
        'onmousedown="' +
        this.job.onmousedown +
        '" ' +
        'href="' +
        this.job.url +
        '">' +
        this.job.title +
        '</a>'
      )
    }
  },
  methods: {
    clicked() {
      this.$store.dispatch('jobs/log', {
        link: this.job.url
      })
    }
  }
}
</script>
