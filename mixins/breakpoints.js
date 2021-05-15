export default {
  methods: {
    sm() {
      // Detect breakpoint by checking computing style of an element which uses the bootstrap classes.  It
      let ret = false

      if (process.client) {
        const el = this.$refs.breakpoint
        if (el) {
          const display = getComputedStyle(el, null).display

          if (display === 'none') {
            ret = true
          }
        }
      }

      return ret
    }
  }
}
