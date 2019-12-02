<template>
  <footer class="footer mt-2 mb-2">
    <div class="d-flex flex-column">
      <ul class="d-flex flex-column flex-md-row justify-content-between list-unstyled p-0 ml-2 mr-2">
        <li>
          <nuxt-link to="/about" class="menu__link">
            <v-icon name="info-circle" class="link__icon" />
            About
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/terms" class="menu__link">
            <v-icon name="book-open" class="link__icon" />
            Terms
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/privacy" class="menu__link">
            <v-icon name="lock" class="link__icon" />
            Privacy
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/disclaimer" class="menu__link">
            <v-icon name="gavel" class="link__icon" />
            Disclaimer
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/donate" class="menu__link">
            <v-icon name="hand-holding-heart" class="link__icon" />
            Donate
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/contact" class="menu__link">
            <v-icon name="envelope" class="link__icon" />
            Contact
          </nuxt-link>
        </li>
      </ul>

      <div class="text-muted">
        Freegle is registered as a charity with HMRC (ref. XT32865).
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'MainFooter'
}
</script>

<style scoped lang="scss">
@import 'color-vars';
@import 'node_modules/bootstrap/scss/functions';
@import 'node_modules/bootstrap/scss/variables';
@import 'node_modules/bootstrap/scss/mixins/_breakpoints';

.footer {
  max-width: map-get($grid-breakpoints, 'md');
  margin: 0 auto;
}

@include media-breakpoint-up(md) {
  .menu__link {
    border: 1px $color-black solid;
    border-radius: 0.25rem;
    background-color: $color-white;
    padding: 0.375rem 0.75rem;
    color: $color-black;
  }
}

.link__icon {
  display: none;
}

@include media-breakpoint-up(md) {
  .link__icon {
    display: inline-block;
  }
}
</style>
