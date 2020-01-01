// We can log in with u=uid and k=val.

export default async function({ store, route, app }) {
  if (route.query.u && route.query.k) {
    // Log in using the username and key
    await store.dispatch('auth/login', {
      u: route.query.u,
      k: route.query.k,
      force: true
    })

    app.router.push('/chitchat')
  }
}
