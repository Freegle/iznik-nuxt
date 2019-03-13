import axios from 'axios'

export default function({ store, redirect }) {
  console.log('Middleware')
  store.commit('security/AUTHENTICATING')

  return axios
    .get(process.env.API + '/locations', {
      redirect: 'manual'
    })
    .then(response => {
      console.log('Got session', response)
      store.commit('security/AUTHENTICATING_SUCCESS', response)
      return redirect('/')
    })
    .catch(() => {
      console.log('Got error')
      store.commit('security/AUTHENTICATING_ERROR')
    })
}
