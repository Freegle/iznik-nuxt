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
    }
  }
})
