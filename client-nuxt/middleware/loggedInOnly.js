import axios from 'axios'
import jwtDecode from 'jwt-decode'

export default function({ route, store, redirect }) {
  // This is a page we can only view when logged in.
  //
  // We want to check if we are already logged in by querying the server using any token that we have in the store,
  // which is persisted to local storage.  If we are logged in then nothing to do, else redirect to the login page.
  store.commit('security/AUTHENTICATING')

  // Add token header if we have it.
  const token = store.getters['security/token']

  if (token) {
    // We have a token, but check whether it's expired.
    // TODO Would be nice to render the page optimistically if we have a token.
    const dec = jwtDecode(token)

    const now = new Date().getTime() / 1000

    if (dec.exp < now) {
      axios.defaults.headers.common.Authorization = 'Bearer ' + token.toString()
    }
  } else {
    axios.defaults.headers.common.Authorization = null
  }

  // Now make an API call to see if we're logged in.
  return axios
    .get(process.env.API + '/locations')
    .then(response => {
      // We're logged in.  No need to save the token - it's already in the store.
      store.commit('security/AUTHENTICATING_SUCCESS', null)
    })
    .catch(() => {
      // We're not logged in.
      if (store.getters.authenticated) {
        // ...but we thought we were. Correct our misapprehension.
        store.commit('security/LOGOUT')
      }

      // Ask them to log in.
      return redirect('/login')
    })
}
