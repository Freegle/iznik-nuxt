<template>
  <div v-if="loggedIn" class="wrapper" title="Toggle between the full website and a simplified version">
    <OurToggle
      :value="view"
      :height="36"
      :width="150"
      :font-size="14"
      :labels="{unchecked: 'Simple Website', checked: 'Full Website'}"
      class="toggle"
      @change="change"
    />
  </div>
</template>
<script>
const OurToggle = () => import('~/components/OurToggle')

export default {
  components: { OurToggle },
  computed: {
    view() {
      return !this.simple
    }
  },
  methods: {
    async change(e) {
      const settings = this.me.settings
      settings.simple = !e.value
      await this.$store.dispatch('auth/saveAndGet', {
        settings: settings
      })
    }
  }
}
</script>
<style scoped>
.wrapper {
  top: 15px;
  position: absolute;
}
</style>
