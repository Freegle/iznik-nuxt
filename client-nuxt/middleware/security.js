import axios from 'axios'

export default function({ store, redirect }) {
  store.commit('security/AUTHENTICATING')

  // Add token header if we have it.
  const token = store.state.security.token

  if (token) {
    axios.defaults.headers.common.Authorization = 'Bearer ' + token.toString()
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
      if (store.state.security.isAuthenticated) {
        // ...but we thought we were. Correct our misapprehension.
        store.commit('security/LOGOUT')
      }

      // Ask them to log in.
      return redirect('/login')
    })
}
