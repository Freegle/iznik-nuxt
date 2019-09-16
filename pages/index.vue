<template>
  <div />
</template>

<script>
export default {
  components: {},

  mounted() {
    let route = '/chitchat'

    if (process.browser) {
      // Set up a watch on the store.  We do this because initially the store hasn't yet been reloaded from local
      // storage, so we don't know if we're logged in. When it does get loaded, this watch will fire.
      this.$store.watch(
        (state, getters) => {
          const user = this.$store.getters['auth/user']()
          console.log('Watch', user)
          return user
        },
        (newValue, oldValue) => {
          console.log('Got new', newValue)
          if (newValue) {
            // Logged in - on client side we want to load the last page, for logged in users.
            try {
              const lastRoute = localStorage.getItem('Iznik>lasthomepage')

              if (!lastRoute || lastRoute === 'news') {
                route = '/chitchat'
              } else {
                route = '/mygroups'
              }

              console.log('Last route', this.$nuxt.path, route)
              if (this.$nuxt.path !== route) {
                this.$router.push(route)
              }
            } catch (e) {
              console.log('Exception', e)
            }
          }
        }
      )
    }
  }
}
</script>
