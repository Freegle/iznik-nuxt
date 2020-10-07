<template>
  <b-container fluid>
    <b-row class="m-0">
      <b-col cols="0" lg="3" class="d-none d-lg-block p-0 pr-1" />
      <b-col cols="12" lg="6" class="p-0">
        <div v-if="place">
          <h1 class="sr-only">
            Freegling near {{ place.name }}
          </h1>
          <AdaptiveMap v-if="initialBounds" :initial-bounds="initialBounds" />
        </div>
        <b-alert v-else show variant="danger">
          Something went wrong.  Please contact us to let us know what you were trying to do.
          <ExternalLink href="mailto:support@ilovefreegle.org">
            support@ilovefreegle.org
          </ExternalLink>
        </b-alert>
      </b-col>
      <b-col cols="0" lg="3" class="d-none d-lg-block p-0 pl-1" />
    </b-row>
  </b-container>
</template>
<script>
import AdaptiveMap from '../../../components/AdaptiveMap'
import ExternalLink from '../../../components/ExternalLink'
import buildHead from '@/mixins/buildHead.js'
import loginOptional from '@/mixins/loginOptional.js'

export default {
  components: { ExternalLink, AdaptiveMap },
  mixins: [loginOptional, buildHead],
  data: function() {
    return {
      initialBounds: null,
      place: null
    }
  },
  created() {
    this.place = this.$route.params.place
      ? JSON.parse(this.$route.params.place)
      : null
  },
  mounted() {
    this.initialBounds = this.place.bbox
  },
  head() {
    return this.buildHead(
      'Explore Freegle',
      "There are lots of lovely communities of freeglers across the UK. Shall we see what they're up to?",
      null
    )
  }
}
</script>
