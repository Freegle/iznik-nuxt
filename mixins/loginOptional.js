// Login is optional on this page
export default {
  mounted() {
    // We  do this check on the client side.  That's because we have trouble with whether the server is logged
    // in or not, and for our purposes we only really care about SSR for logged out pages, and therefore we don't need to
    // render the page correctly if they are in fact on the client.  So we can live with that.
    if (!process.server) {
      if (this.$store.getters['auth/forceLogin']() !== false) {
        this.$store.dispatch('auth/forceLogin', false)
      }
    }
  }
}
