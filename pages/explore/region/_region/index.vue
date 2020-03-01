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
  async asyncData({ app, params, store }) {
    await store.dispatch('group/list', {
      grouptype: 'Freegle'
    })

    return {
      region: params.region
    }
  },
  head() {
    return this.buildHead('Explore Freegle communities in ' + this.region)
  }
}
</script>
