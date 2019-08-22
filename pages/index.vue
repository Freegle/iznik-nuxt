<template>
  <div />
</template>

<script>
export default {
  components: {},

  mounted() {
    console.log('Landing page mounted')
    let route = '/chitchat'

    if (process.browser && this.$store.state.auth.user) {
      // On client side we want to load the last page, for logged in users.
      console.log('On client side', this.$store.state.auth.user)
      try {
        const lastRoute = localStorage.getItem('Iznik>lasthomepage')
        console.log('Got last route', lastRoute)

        if (!lastRoute || lastRoute === 'news') {
          route = '/chitchat'
        } else {
          route = '/mygroups'
        }
      } catch (e) {
        console.log('Exception', e)
      }

      console.log('Current', this.$nuxt.path, route)
      if (this.$nuxt.path !== route) {
        this.$router.push(route)
      }
    }
  }
}
</script>
