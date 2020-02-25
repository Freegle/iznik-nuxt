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
        this.me &&
        (this.me.systemrole === 'Moderator' ||
          this.me.systemrole === 'Support' ||
          this.me.systemrole === 'Admin')
      )
    },
    support() {
      return this.me && this.me.systemrole === 'Support'
    },
    admin() {
      return this.me && this.me.systemrole === 'Admin'
    },
    supportOrAdmin() {
      return (
        this.me &&
        (this.me.systemrole === 'Support' || this.me.systemrole === 'Admin')
      )
    },
    simple() {
      let ret = true

      if (!this.me) {
        // Always show simple for logged out.
        ret = true
        // console.log('Logged out - simple')
      } else if (
        this.me.settings &&
        (this.me.settings.simple === true || this.me.settings.simple === false)
      ) {
        // We have a preference.
        ret = this.me.settings.simple
        // console.log('Preference - simple', ret)
      } else if (
        this.me.added &&
        Date.now() - new Date(this.me.added).getTime() < 3 * 24 * 60 * 60 * 1000
      ) {
        // We have no preference and we're a new user.
        ret = true
        // console.log('No preference, new', this.me.added)
      } else {
        // We have no preference and we're an established user.
        ret = false
        // console.log('No preference, established')
      }

      // console.log('compute simple', ret, this.me)
      return ret
    },
    // Permissions. We have these as individual computed properties so they can be cached.
    hasPermissionNewsletter() {
      return this.hasPermission('Newsletter')
    }
  },
  methods: {
    hasPermission(perm) {
      const perms = this.me ? this.me.permissions : null
      return perms && perms.indexOf(perm) !== -1
    }
  }
})
