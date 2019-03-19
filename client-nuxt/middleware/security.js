import axios from 'axios'

// Middleware for all pages except login. We want to check whether we're logged in by querying the server using
// any token we have.  If we're not, redirect to login.
//
// TODO For a SSR app, middleware will be called on the server, and we won't have access to the store which is
// persisted in local storage.  So this will always say we're logged out, but it will work for page
// transitions once the initial page load is done.
export default function({ route, store, redirect }) {
  console.log(
    'security Middleware',
    route && route.hasOwnProperty('fullPath') ? route.fullPath : 'undefined'
  )

  // What we want to do depends on whether we're loading the login page or another page.
  if (route.fullPath === '/login') {
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
  } else {
    // We want to check if we are already logged in by querying the server using any token that we have in the store,
    // which is persisted to local storage.  If we are logged in then nothing to do, else redirect to the login page.
    store.commit('security/AUTHENTICATING')

    // Add token header if we have it.
    const token = store.getters['security/token']
    console.log('Token on other page?', token)

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
        if (store.getters.authenticated) {
          // ...but we thought we were. Correct our misapprehension.
          store.commit('security/LOGOUT')
        }

        // Ask them to log in.
        return redirect('/login')
      })
  }
}
