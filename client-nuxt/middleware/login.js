import axios from 'axios'

export default function({ route, store, redirect }) {
  console.log('login Middleware')

  // In this case we can only be running on the client side, because serverMiddleware forces SPA mode for this
  // path.
  //
  // We want to check if we are already logged in by querying the server using any token that we have in the store,
  // which is persisted to local storage.  If we are logged in then redirect to the home page, else stay on the
  // login page.
  store.commit('security/AUTHENTICATING')

  // Add token header if we have it.
  const token = store.getters['security/token']
  console.log('Token on login page?', token)

  if (token) {
    axios.defaults.headers.common.Authorization = 'Bearer ' + token.toString()
  } else {
    axios.defaults.headers.common.Authorization = null
  }

  return axios
    .get(process.env.API + '/locations', {
      redirect: 'manual'
    })
    .then(response => {
      console.log('Got session', response)
      store.commit('security/AUTHENTICATING_SUCCESS', response.data.token)
      return redirect('/')
    })
    .catch(() => {
      console.log('Got error')
      store.commit('security/AUTHENTICATING_ERROR')
    })
}
