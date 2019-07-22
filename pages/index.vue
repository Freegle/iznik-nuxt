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

  created() {
    console.log('index created', this.$auth.user)
  },
  mounted() {
    console.log('index mounted', this.$store.state.auth.user)
  },
  updated() {
    console.log('index updated', this.$store.state.auth.user)
  }
}
</script>
