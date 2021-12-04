<template>
  <VisualiseMap class="map" />
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
<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.map {
  @include media-breakpoint-up(sm) {
    height: 300px;
  }

  @include media-breakpoint-up(lg) {
    height: calc(100vh - 150px);
    max-height: 800px;
  }
}
</style>
