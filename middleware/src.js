// Log any entries with a src parameter.

export default function({ store, route, $axios }) {
  if (route.query.src) {
    return $axios
      .post(process.env.API + '/src', {
        src: route.query.src
      })
      .catch(e => {
        console.error('SRC log failed', e)
      })
  }
}
