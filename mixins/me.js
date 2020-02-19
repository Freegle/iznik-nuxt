// Global mixin so that every component can access the logged in state and user.
import Vue from 'vue'

Vue.mixin({
  computed: {
    me() {
      return this.$store.getters['auth/user']
    },
    myid() {
      return this.me ? this.me.id : null
    },
    loggedIn() {
      return this.me !== null
    },
    mod() {
      return (
        this.me.systemrole === 'Moderator' ||
        this.me.systemrole === 'Support' ||
        this.me.systemrole === 'Admin'
      )
    },
    simple() {
      console.log('compute simple', this.me)
      if (!this.me) {
        // Always show simple for logged out.
        return true
      } else if (
        this.me.settings &&
        (this.me.settings.simple === true || this.me.settings.simple === false)
      ) {
        // We have a preference.
        return this.me.settings.simple
      } else if (
        this.me.added &&
        Date.now() - new Date(this.me.added).getTime() < 3 * 24 * 60 * 60 * 1000
      ) {
        // We have no preference and we're a new user.
        return true
      } else {
        // We have no preference and we're an established user.
        return false
      }
    }
  }
})
