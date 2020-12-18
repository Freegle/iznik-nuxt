<template>
  <div class="footer w-100 mt-4">
    <div class="d-flex flex-column">
      <div class="d-flex justify-content-center mb-2">
        <a target="_blank" rel="noopener" href="https://www.bytemark.co.uk/company/case-studies/freegle/" class="d-flex justify-content-start flex-column mr-4">
          <img src="/bytemark.png" alt="Bytemark Logo" class="sponsor">
        </a>
        <a target="_blank" rel="noopener" href="https://www.mythic-beasts.com" class="d-flex justify-content-start flex-column ml-4">
          <img src="/mythic-beasts.png" alt="Mythic Beasts Logo" class="sponsor">
        </a>
      </div>
      <div class="d-flex flex-column justify-content-end small pl-2 pr-2 mb-2">
        <div class="text-muted text-center mb-1">
          Freegle is registered as a charity with HMRC (ref. XT32865). Kindly supported by Bytemark and Mythic Beasts.
        </div>
      </div>
      <div class="d-flex justify-content-between">
        <nuxt-link to="/about" class="menu__link">
          <v-icon name="info-circle" class="link__icon" />
          About
        </nuxt-link>
        <nuxt-link to="/terms" class="menu__link">
          <v-icon name="book-open" class="link__icon" />
          Terms
        </nuxt-link>
        <nuxt-link to="/privacy" class="menu__link">
          <v-icon name="lock" class="link__icon" />
          Privacy
        </nuxt-link>
        <nuxt-link to="/disclaimer" class="menu__link">
          <v-icon name="gavel" class="link__icon" />
          Disclaimer
        </nuxt-link>
        <nuxt-link to="/donate" class="menu__link">
          <v-icon name="hand-holding-heart" class="link__icon" />
          Donate
        </nuxt-link>
        <nuxt-link to="/help" class="menu__link">
          <v-icon name="envelope" class="link__icon" />
          Contact
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainFooter'
}
</script>

<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.footer {
  //max-width: map-get($grid-breakpoints, 'md');
  margin: 0 auto;
}

.menu__link {
  color: $color-black;
}

.link__icon {
  display: none;
}

@include media-breakpoint-up(lg) {
  .link__icon {
    display: inline-block;
  }
}

.sponsor {
  width: 165px;

  @include media-breakpoint-down(md) {
    width: 99px;
  }
}
</style>
