<template>
  <ExploreMap :region="region" />
</template>
<script>
import loginOptional from '@/mixins/loginOptional.js'
const ExploreMap = () => import('~/components/ExploreMap.vue')

export default {
  components: {
    ExploreMap
  },
  mixins: [loginOptional],
  data: function() {
    return {
      region: null
    }
  },
  created() {
    console.log('Region', this.$route.params)
    this.region = this.$route.params.region
  }
}
</script>
