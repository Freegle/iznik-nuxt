export default {
  data() {
    return {
      showModal: false
    }
  },
  created() {
    // Register a hook for routing so that we can close the modal rather than move route.  This is to handle the
    // back button case, where you expect the back button to close the modal.
    //
    // This is a bit of a hack, but there doesn't seem to be a good way to do it.  If we have routed to a chat
    // from within a modal then make sure we route to it - this is a case that happens if you Message someone from
    // a modal on mobile.
    const unregisterRouterGuard = this.$router.beforeEach((to, from, next) => {
      if (to.path.indexOf('/chats') === -1) {
        this.back(next)
      } else {
        // It's to a chat.
        next()
      }
    })

    this.$once('hook:destroyed', () => {
      unregisterRouterGuard()
    })
  },
  methods: {
    show() {
      console.log('modal mixin show')
      this.showModal = true
    },
    hide() {
      console.log('modal mixin hide')
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
