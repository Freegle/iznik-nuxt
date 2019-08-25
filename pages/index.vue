<template>
  <div />
</template>

<script>
export default {
  components: {},

  mounted() {
    let route = '/chitchat'
    const me = this.$store.getters['auth/user']()

    if (process.browser && me) {
      // Logged in - on client side we want to load the last page, for logged in users.
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
