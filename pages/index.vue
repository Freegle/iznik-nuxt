<template>
  <div />
</template>

<script>
export default {
  components: {},

  mounted() {
    let route = '/chitchat'

    if (process.browser && this.$store.state.auth.user) {
      // On client side we want to load the last page, for logged in users.
      try {
        const lastRoute = localStorage.getItem('Iznik>lasthomepage')

        if (!lastRoute || lastRoute === 'news') {
          route = '/chitchat'
        } else {
          route = '/mygroups'
        }
      } catch (e) {
        console.log('Exception', e)
      }

      if (this.$nuxt.path !== route) {
        this.$router.push(route)
      }
    }
  }
}
</script>
