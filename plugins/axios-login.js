export default function({ store, app: { $axios, redirect } }) {
  $axios.onResponse(response => {
    if (
      response.data &&
      response.data.ret === 1 &&
      response.data.status === 'Not logged in'
    ) {
      // We have made an API request and been told we're not logged in.  Clear the auth in the store.
      store.dispatch('auth/setUser', null)
    }
  })
}
