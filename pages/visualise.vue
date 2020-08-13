<template>
  <VisualiseMap />
</template>
<script>
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
const VisualiseMap = () => import('~/components/VisualiseMap')

export default {
  components: {
    VisualiseMap
  },
  mixins: [loginOptional, buildHead],
  head() {
    return this.buildHead('Show Freegle posts happening on a map')
  }
}
</script>
