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
    <b-card v-else no-body variant="info" :class="highlight ? 'bg-info': ''">
      <b-card-body>
        <b-card-title>
          {{ job.title }}
        </b-card-title>
        <b-card-sub-title v-if="job.location || job.postcode">
          <span v-if="job.location">
            {{ job.location }}
          </span>
          <span v-if="job.location && job.postcode">
            -
          </span>
          <span v-if="job.postcode">
            {{ job.postcode }}
          </span>
          <span v-if="job.salary" class="float-right">
            {{ job.salary }}
          </span>
        </b-card-sub-title>
        <b-row>
          <b-col>
            <div class="media clickme">
              <div class="media-left" />
              <div class="media-body w-100">
                <p class="text-truncate mt-2">
                  {{ job.snippet }}
                </p>
              </div>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <a :onmousedown="job.onmousedown" target="_blank" :href="job.url" class="float-left">
              <b-btn variant="info">
                More info <v-icon name="angle-double-right" />
              </b-btn>
            </a>
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
import 'vue-awesome/icons/angle-double-right'

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
  }
}
</script>
