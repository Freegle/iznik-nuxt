<template>
  <ExploreMap :region="region" />
</template>
<script>
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'

const ExploreMap = () => import('~/components/ExploreMap.vue')

export default {
  components: {
    ExploreMap
  },
  mixins: [loginOptional, buildHead],
  data: function() {
    return {
      region: null
    }
  },
  asyncData({ app, params, store }) {
    return {
      region: params.region
    }
  },
  head() {
    return this.buildHead('Explore Freegle communities in ' + this.region)
  }
}
</script>
