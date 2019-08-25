export const getMatchedComponents = (route, matches = false) => {
  return [].concat.apply(
    [],
    route.matched.map(function(m, index) {
      return Object.keys(m.components).map(function(key) {
        matches && matches.push(index)
        return m.components[key]
      })
    })
  )
}

export default function(ctx) {
  console.log('auth Middleware entry')
  // Disable middleware if no route was matched to allow 404/error page
  const matches = []
  const Components = getMatchedComponents(ctx.route, matches)
  if (!Components.length) {
    console.log('auth Middleware - no route matched, allow')
    return
  }

  console.log('auth Middleware', ctx.store.state.auth)

  if (ctx.store.state.auth.user) {
    // We're logged in - we can see any page.
    console.log('Logged in')
  } else {
    // We're not logged in.  But we need to be.  Set the store variable which will force the default layout to
    // show the login modal on top of whatever page it is.
    console.log('Not logged in but should be')
    ctx.store.commit('auth/forceLogin')
  }
}
