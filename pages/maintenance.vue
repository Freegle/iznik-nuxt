<template>
  <div class="d-flex justify-content-center">
    <div class="maintenance__container px-3 bg-white">
      <h1 class="mt-4">
        <v-icon name="cog" scale="4" />
        Sorry - we're doing some maintenance
      </h1>
      <p>
        We're doing some maintenance work just now - one on't cross beams gone owt askew on treadle,
        the dilithium crystals need polishing, the server pie has a soggy bottom, that kind of thing.
      </p>
      <p>
        Usually this doesn't take more than an hour or two.  Please try again later.
      </p>
      <p>
        P.S. We know this is a bit of a pain, and we try really hard to avoid taking the whole site down where we can.
        Very occasionally we need to do it.  If you want to
        <!-- eslint-disable-next-line -->
        <ExternalLink href="https://www.paypal.com/gb/fundraiser/charity/55681">donate a quid</ExternalLink>,
        that'll help it happen less often.
      </p>
    </div>
  </div>
</template>

<script>
import buildHead from '@/mixins/buildHead.js'
import ExternalLink from '@/components/ExternalLink'

export default {
  components: { ExternalLink },
  mixins: [buildHead],
  layout: 'empty',
  head() {
    return this.buildHead('Maintenance', "We're down just now.")
  }
}
</script>

<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.maintenance__container {
  width: 100%;

  @include media-breakpoint-up(md) {
    width: 50%;
  }
}
</style>
