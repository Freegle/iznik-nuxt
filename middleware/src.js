// Log any entries with a src parameter.
import axios from 'axios'

export default function({ store, route }) {
  const API = process.env.IZNIK_API ? process.env.IZNIK_API : 'http://localhost:3000/'

  if (route.query.src) {
    return axios
      .post(API + '/api/src', {
        src: route.query.src
      })
      .catch(e => {})
  }
}
