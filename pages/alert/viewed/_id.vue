<template>
  <div class="d-flex justify-content-center">
    <div class="privacy__container px-3 bg-white">
      <h2>
        Thanks for letting us know
      </h2>
      <p>
        Email doesn't always get through, or sometimes lands in spam, so it's really helpful to know that you
        received this.
      </p>
      <p>
        You can close this page now.
      </p>
    </div>
  </div>
</template>
<script>
import loginRequired from '@/mixins/loginRequired.js'

export default {
  components: {},
  mixins: [loginRequired],
  data: function() {
    return {
      id: null
    }
  },
  watch: {
    me(newVal, oldVal) {
      if (!oldVal && newVal) {
        // We weren't logged in on load but we are now.
        this.record()
      }
    }
  },
  created() {
    this.id = parseInt(this.$route.params.id) || null
  },
  async mounted() {
    if (this.id) {
      await this.record()
    }
  },
  methods: {
    async record() {
      await this.$store.dispatch('alert/record', {
        id: this.id
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.privacy__container {
  width: 100%;

  @include media-breakpoint-up(md) {
    width: 50%;
  }
}
</style>
