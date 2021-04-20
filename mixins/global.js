import Router from 'vue-router'

// The Vue router has changed in a way that forces errors to be handled.  See
// https://github.com/vuejs/vue-router/issues/2881
const originalPush = Router.prototype.push

Router.prototype.push = function push(location, onResolve, onReject) {
  console.log('Router push', onResolve, onReject)
  if (onResolve || onReject) {
    console.log('Call original router push with callbacks')
    return originalPush.call(this, location, onResolve, onReject)
  }

  console.log('Call original router push without callbacks')
  const ret = originalPush.call(this, location)

  // Should return promise, but we've seen Sentry errors suggesting that doesn't always happen.
  console.log('Router push returned', ret)
  if (typeof ret.then === 'function') {
    console.log('Router push returned promise')
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
