<template>
  <div class="footer w-100 mt-4">
    <div class="d-flex flex-column">
      <div class="d-flex justify-content-center mb-2">
        <a target="_blank" rel="noopener" href="https://affiliate.k.io/go/Freegle-Krystal" class="d-flex justify-content-start flex-column mr-4">
          <b-img src="/krystal.png" alt="Krystal Logo" class="sponsor" /></a>
        <a target="_blank" rel="noopener" href="https://www.mythic-beasts.com" class="d-flex justify-content-start flex-column ml-4">
          <img src="/mythic-beasts.png" alt="Mythic Beasts Logo" class="sponsor">
        </a>
      </div>
      <div class="d-flex flex-column justify-content-end small mb-2">
        <div class="text-muted text-center mb-1">
          Freegle is registered as a charity with HMRC (ref. XT32865). Kind support from Krystal & Mythic Beasts.
        </div>
      </div>
      <div class="d-flex justify-content-between navlinks">
        <nuxt-link to="/about" class="menu__link">
          <client-only>
            <v-icon name="info-circle" class="link__icon" />
          </client-only>
          About
        </nuxt-link>
        <nuxt-link to="/terms" class="menu__link">
          <client-only>
            <v-icon name="book-open" class="link__icon" />
          </client-only>
          Terms
        </nuxt-link>
        <nuxt-link to="/privacy" class="menu__link">
          <client-only>
            <v-icon name="lock" class="link__icon" />
          </client-only>
          Privacy
        </nuxt-link>
        <nuxt-link to="/disclaimer" class="menu__link">
          <client-only>
            <v-icon name="gavel" class="link__icon" />
          </client-only>
          Disclaimer
        </nuxt-link>
        <nuxt-link to="/donate" class="menu__link">
          <client-only>
            <v-icon name="hand-holding-heart" class="link__icon" />
          </client-only>
          Donate
        </nuxt-link>
        <nuxt-link to="/help" class="menu__link">
          <client-only>
            <v-icon name="envelope" class="link__icon" />
          </client-only>
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

.navlinks {
  @include media-breakpoint-down(xs) {
    font-size: 0.8rem;
  }
}
</style>
