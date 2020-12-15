<template>
  <div class="d-flex justify-content-center">
    <div class="privacy__container px-3 bg-white">
      <h1>COVID-19 - Safe Freegling</h1>
      <CovidSafeFreegling />
    </div>
  </div>
</template>

<script>
import buildHead from '@/mixins/buildHead.js'
import CovidSafeFreegling from '../components/CovidSafeFreegling'

export default {
  components: { CovidSafeFreegling },
  mixins: [buildHead],
  head() {
    return this.buildHead(
      'COVID-19 - Safe Freegling',
      'How to freegle and stay safe from COVID-19'
    )
  }
}
</script>

<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.privacy__container {
  width: 100%;

  @include media-breakpoint-up(md) {
    width: 50%;
  }
}
</style>
