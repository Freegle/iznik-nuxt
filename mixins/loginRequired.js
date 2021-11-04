// We want to force a login.
export default {
  mounted() {
    // We  do this check on the client side.  That's because we have trouble with whether the server is logged
    // in or not, and for our purposes we only really care about SSR for logged out pages, and therefore we don't need to
    // render the page correctly if they are in fact logged in on the client.  So we can live with that.
    if (!process.server) {
      // Initial value
      this.$store.dispatch('auth/forceLogin', this.me === null)

      // Set up a watch on the store.  We do this because initially the store hasn't yet been reloaded from local
      // storage, so we don't know if we're logged in. When it does get loaded, this watch will fire.  So this way
      // we'll end up with the correct value of forceLogin set.
      this.loginRequiredWatch = this.$store.watch(
        () => {
          return this.me
        },
        newValue => {
          if (!newValue) {
            this.$store.dispatch('auth/forceLogin', true)
          } else {
            this.$store.dispatch('auth/forceLogin', false)
          }
        }
      )

      // Fire off a get of our user, to make sure we're roughly in sync (groups, whether we're logged in).  Defer
      // it as we can get snappier rendering of pages if this isn't the first request.
      setTimeout(() => {
        this.fetchMe(['me', 'groups'])
      }, 100)
    }
  },

  beforeDestroy() {
    if (this.loginRequiredWatch) {
      this.loginRequiredWatch()
    }
  }
}
