<template>
  <div class="d-flex justify-content-center">
    <div class="privacy__container px-3 bg-white">
      <h1 class="text-center">
        Norfolk Freegle - We've moved!
      </h1>
      <p>
        Norfolk and Waveney Freegle has moved to this new website.  Don’t worry! It’s still free, run by volunteers
        and focused on keeping useful things out of landfill. We now offer easier use on mobile devices and better
        access to neighbouring Freegle communities.
      </p>
      <p>
        This website uses communities based on towns in order to show Offers and Requests, and you can easily join
        one or more groups to tailor what is local for you. You can use the site via your browser or the
        <!-- eslint-disable-next-line-->
        <nuxt-link to="/mobile">Freegle app</nuxt-link>.
      </p>
      <p>
        We closed the old Norfolk & Waveney Freegle site on 26th March 2020 with memberships, passwords and current
        offers/requests/transactions for the past 30 days being transferred over. Everyone was allocated to a
        community based on the postcode(s) on their Norfolk Freegle account. If you had an account on Norfolk Freegle,
        you can now use the same details in order to sign in to Freegle.
      </p>
      <b-btn variant="success" size="lg" to="/chitchat" class="mb-1">
        Sign in to Freegle
      </b-btn>
      <p>
        Any questions?  There is a Help page <nuxt-link to="/help">
          here
        </nuxt-link>
        and you are always very welcome to email us directly if that doesn’t give you the answers.
      </p>
      <p>
        We’re excited to be on this new website, we hope you enjoy freegling with us here.
      </p>
    </div>
  </div>
</template>

<script>
import buildHead from '@/mixins/buildHead.js'

export default {
  mixins: [buildHead],
  head() {
    return this.buildHead(
      "Norfolk Freegle - We've moved!",
      'Norfolk and Waveney Freegle have moved to www.ilovefreegle.org'
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
