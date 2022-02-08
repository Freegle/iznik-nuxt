// Log any entries with a src parameter.

// For app, deep-links into the app are handled in app-init-push.js

export default function({ store, route, $axios }) {
  if (route.query.src) {
    console.log('========== route.query.src', route.query.src)
    return $axios
      .post(process.env.API + '/src', {
        src: route.query.src
      })
      .catch(e => {
        console.error('SRC log failed', e)
      })
  }
}
