<template>
  <section class="container">
    <p>
      Hello
      <span
        v-if="loggedInUser"
      >
        {{ loggedInUser.fullname }}
      </span>
    </p>
    <nuxt-link to="/explore/EdinburghFreegle">
      EdinburghFreegle
    </nuxt-link>
  </section>
</template>

<script>
export default {
  components: {},

  computed: {
    loggedInUser() {
      // This needs to be in data to make it reactive.
      return this.$store.state.auth.user
    }
  }
}
</script>
