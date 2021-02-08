export default {
  data() {
    return {
      showModal: false
    }
  },
  created() {
    // Register a hook for routing so that we can close the modal rather than move route.
    const unregisterRouterGuard = this.$router.beforeEach((to, from, next) => {
      this.back(next)
    })

    this.$once('hook:destroyed', () => {
      unregisterRouterGuard()
    })
  },
  methods: {
    show() {
      this.showModal = true
    },
    hide() {
      this.showModal = false
    },
    back(next) {
      if (this.showModal) {
        // Back should close the modal
        this.showModal = false
      } else {
        // No modal open - proceed with back.
        next()
      }
    }
  }
}
