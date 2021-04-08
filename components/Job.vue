<template>
  <div @click="clicked">
    <div v-if="summary" class="ml-2 mr-2">
      <h4>
        {{ job.title }}
        <span v-if="job.location" class="text-muted">
          {{ location }}
        </span>
      </h4>
      <p class="text-truncate mt-2 d-none d-lg-block">
        {{ body }}
      </p>
    </div>
    <b-card v-else no-body variant="info" :class="highlight ? 'job-row bg-info': 'job-row'">
      <b-card-body class="job-row">
        <b-card-title class="job-title">
          {{ job.title }}
        </b-card-title>
        <b-card-sub-title v-if="job.location">
          <span class="location">
            {{ location }}
          </span>
        </b-card-sub-title>
        <b-row>
          <b-col>
            <div class="media clickme">
              <div class="media-left" />
              <div class="media-body w-100">
                <p class="text-truncate mt-2 job-description">
                  {{ body }}
                </p>
              </div>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-btn :href="job.url" target="_blank" variant="info">
              More Info
            </b-btn>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>
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
    location() {
      if (
        this.job &&
        this.job.location &&
        this.job.location.indexOf(', ') === 0
      ) {
        return this.job.location.substring(2)
      } else {
        return this.job.location
      }
    },
    body() {
      if (!this.job || !this.job.body) {
        return ''
      }

      return this.job.body.replace(/\\n/g, '\n').trim()
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

<style scoped>
.job__summary {
  font-weight: 500;
}
</style>
