// Our server auth works a little oddly, so we need to make sure that the session token is present on all requests.
export default function({ $axios, app, store }) {
  $axios.onRequest(config => {
    // console.log('Axios request', store.state.auth.user.persistent)
    if (
      store.state.auth &&
      store.state.auth.user &&
      store.state.auth.user.persistent
    ) {
      config.headers.common.Authorization =
        'Iznik ' + JSON.stringify(store.state.auth.user.persistent)
    }
  })
}
