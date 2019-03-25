// ~/plugins/localStorage

import createPersistedState from 'vuex-persistedstate'

export default ({ app, store, $axios, isHMR }) => {
  // We can only do this on the client side.
  if (process.browser) {
    // When we're doing HMR (Hot Module Reload), the store mutation happens before the nuxtReady event, which
    // means that any previously saved state will be replaced by state from the server.  We don't want that, so
    // skip HMR.
    if (isHMR) return

    createPersistedState({
      key: 'rotavator',

      // List the store paths that we want to persist.
      paths: ['localization.locale', 'security', 'locations', 'people', 'slots']
    })(store)
  }
}
