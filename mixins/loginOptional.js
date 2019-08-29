// Login is optional on this page
import Vue from 'vue'

export default Vue.mixin({
  mounted() {
    // We  do this check on the client side.  That's because we have trouble with whether the server is logged
    // in or not, and for our purposes we only really care about SSR for logged out pages, and therefore we don't need to
    // render the page correctly if they are in fact on the client.  So we can live with that.
    if (!process.server) {
      this.$store.dispatch('auth/forceLogin', false)
    }
  }
})
