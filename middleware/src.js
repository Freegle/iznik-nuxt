// Log any entries with a src parameter.
import axios from 'axios'

export default function({ store, route }) {
  const API = process.env.API ? process.env.API : 'http://localhost:3000/api'
  console.log('API', API, process.env.API)

  if (route.query.src) {
    return axios
      .post(API + '/src', {
        src: route.query.src
      })
      .catch(e => {})
  }
}
