<template>
  <div>
    <ExploreGroup v-if="id" :id="id" />
    <ExploreMap v-else />
  </div>
</template>
<script>
import loginOptional from '@/mixins/loginOptional.js'
const ExploreGroup = () => import('~/components/ExploreGroup.vue')
const ExploreMap = () => import('~/components/ExploreMap.vue')

export default {
  components: {
    ExploreGroup,
    ExploreMap
  },
  mixins: [loginOptional],
  data: function() {
    return {
      id: null
    }
  },
  created() {
    this.id = this.$route.params.id
  }
}
</script>
