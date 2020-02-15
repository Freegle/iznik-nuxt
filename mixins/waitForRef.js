export default {
  methods: {
    waitForRef(name, callback) {
      // When a component is conditional using a v-if, it sometimes takes more than one tick for it to appear.  So
      // we have a bit of a timer.
      if (this.$refs[name]) {
        callback.apply(this)
      } else {
        setTimeout(() => {
          this.waitForRef(name, callback)
        }, 100)
      }
    }
  }
}
