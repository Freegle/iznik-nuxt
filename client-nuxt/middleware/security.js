import axios from 'axios'

export default function({ store, redirect }) {
  console.log('Middleware')
  store.commit('security/AUTHENTICATING')

  return axios
    .get(process.env.API + '/me')
    .then(response => {
      console.log('Got session', response)
      store.commit('security/AUTHENTICATING_SUCCESS', response)
    })
    .catch(() => {
      console.log('Got error')
      store.commit('security/AUTHENTICATING_ERROR')
      return redirect('/login')
    })
}
