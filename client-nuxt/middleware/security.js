import axios from 'axios'

export default function({ store, redirect }) {
  console.log('Middleware')
  store.commit('security/AUTHENTICATING')

  // Add token header if we have it.
  console.log('Store', store.state)
  const token = store.state.security.token

  if (token) {
    console.log('Add token ' + 'Bearer ' + token.toString())
    axios.defaults.headers.common.Authorization = 'Bearer ' + token.toString()
  } else {
    console.log('Null token')
    axios.defaults.headers.common.Authorization = null
  }

  return axios
    .get(process.env.API + '/locations', {
      token: store.state.security.token
    })
    .then(response => {
      console.log('Got session', response)
      store.commit('security/AUTHENTICATING_SUCCESS', null)
    })
    .catch(() => {
      console.log('Got error')
      if (store.state.security.isAuthenticated) {
        store.commit('security/AUTHENTICATING_ERROR')
      }

      return redirect('/login')
    })
}
