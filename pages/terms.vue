<template>
  <div class="d-flex justify-content-center">
    <div class="terms__container px-3 bg-white">
      <h1 class="text-center">
        Terms of Use
      </h1>
      <TermsOfUse />
      <h3>Got questions?</h3>
      <p>
        If you have questions, please <nuxt-link to="/help">
          contact us.
        </nuxt-link>
      </p>
    </div>
  </div>
</template>
<script>
import buildHead from '@/mixins/buildHead.js'
import TermsOfUse from '~/components/TermsOfUse'

export default {
  components: {
    TermsOfUse
  },
  mixins: [buildHead],
  head() {
    return this.buildHead(
      'Terms of Use',
      "Our Terms of Use.  They're pleasingly short."
    )
  }
}
</script>

<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.terms__container {
  width: 100%;

  @include media-breakpoint-up(md) {
    width: 50%;
  }
}
</style>
