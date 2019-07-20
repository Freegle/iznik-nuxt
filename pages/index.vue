<template>
  <section class="container">
    <p>
      Hello
      <span
        v-if="$store.state.auth.user"
      >
        {{ $store.state.auth.user.fullname }}
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

  mounted: function() {
    console.log('Mounted - logged in?', this.$auth.$state.loggedIn)
  }
}
</script>
