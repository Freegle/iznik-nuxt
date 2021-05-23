<template>
  <div @click="clicked">
    <div v-if="summary" class="ml-2 mr-2">
      <ExternalLink :href="job.url">
        <h4>
          {{ job.title }}
          <span v-if="job.location" class="text-muted">
            {{ location }}
          </span>
        </h4>
        <p class="text-truncate mt-2 d-none d-lg-block black">
          {{ body }}
        </p>
      </ExternalLink>
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
            <ExternalLink :href="job.url">
              <b-btn variant="info">
                More Info
              </b-btn>
            </ExternalLink>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
import ExternalLink from '@/components/ExternalLink'
export default {
  components: { ExternalLink },
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

      return this.job.body
        .replace(/\\n/g, '\n')
        .replace(/<br>/g, '\n')
        .trim()
    }
  },
  methods: {
    clicked() {
      this.$store.dispatch('jobs/log', {
        id: this.job.id
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
