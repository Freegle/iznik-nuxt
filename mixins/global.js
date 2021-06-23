import Router from 'vue-router'
import Vue from 'vue'

// The Vue router has changed in a way that forces errors to be handled.  See
// https://github.com/vuejs/vue-router/issues/2881
const originalPush = Router.prototype.push

Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }

  const ret = originalPush.call(this, location)

  // Should return promise, but we've seen Sentry errors suggesting that doesn't always happen.
  if (typeof ret.then === 'function') {
    return ret.catch(err => {
      if (Router.isNavigationFailure(err)) {
        // resolve err
        return err
      }

      // rethrow error
      return Promise.reject(err)
    })
  }

  return ret
}

Vue.mixin({
  computed: {
    breakpoint() {
      return this.$store.getters['misc/get']('breakpoint')
    }
  }
})
