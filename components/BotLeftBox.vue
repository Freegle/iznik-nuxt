<template>
  <div>
    <b-card class="bg-transparent border-0">
      <div class="flex-wrap d-flex flex-row justify-content-between text-muted small list-unstyled">
        <nuxt-link to="/about" class="p-1">
          About
        </nuxt-link>
        <nuxt-link to="/terms" class="p-1">
          Terms
        </nuxt-link>
        <nuxt-link to="/privacy" class="p-1">
          Privacy
        </nuxt-link>
        <nuxt-link to="/disclaimer" class="p-1">
          Disclaimer
        </nuxt-link>
        <nuxt-link to="/donate" class="p-1">
          Donate
        </nuxt-link>
        <nuxt-link to="/help" class="p-1">
          Contact
        </nuxt-link>
      </div>
      <div>
        <a href="https://www.facebook.com/Freegle/" title="Facebook" target="_blank" class="float-left">
          <img alt="Facebook" src="~/static/facebook.png" width="40">
        </a>
        <a href="https://twitter.com/thisisfreegle" title="Twitter" target="_blank" class="float-left pl-1">
          <img alt="Twitter" src="~/static/twitter.png" width="40">
        </a>
        <a href="https://github.com/Freegle/iznik-nuxt" title="We're open source - find us on GitHub" target="_blank" class="float-right">
          <img alt="GitHub" src="~/static/GitHub_Logo.png">
        </a>
      </div>
    </b-card>
  </div>
</template>
<script>
// TODO DESIGN This should really be sticky to the bottom left, but I failed to get that working with the flex stuff
// for the event sidebar above it.
</script>

<style scoped lang="scss">
@import 'color-vars';

a {
  color: $color-black !important;
}
</style>
