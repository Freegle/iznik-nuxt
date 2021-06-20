<template>
  <span>
    <span ref="xs" class="d-block d-sm-none" />
    <span ref="sm" class="d-none d-sm-block d-md-none" />
    <span ref="md" class="d-none d-md-block d-lg-none" />
    <span ref="lg" class="d-none d-lg-block d-xl-none" />
    <span ref="xl" class="d-none d-xl-block" />
  </span>
</template>
<script>
export default {
  mounted() {
    this.check()
  },
  methods: {
    check() {
      const oldBreakpoint = this.$store.getters['misc/get']('breakpoint')
      let currentBreakpoint = oldBreakpoint
      ;['xs', 'sm', 'md', 'ld', 'xl'].forEach(breakpoint => {
        if (this.$refs[breakpoint]) {
          if (getComputedStyle(this.$refs[breakpoint]).display === 'block') {
            // This breakpoint is visible and is therefore the current one.
            currentBreakpoint = breakpoint
          }
        }

        if (currentBreakpoint !== oldBreakpoint) {
          this.$store.dispatch('misc/set', {
            key: 'breakpoint',
            value: currentBreakpoint
          })
        }
      })

      setTimeout(this.check, 100)
    }
  }
}
</script>
