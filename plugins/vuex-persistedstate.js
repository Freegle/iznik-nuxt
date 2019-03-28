// ~/plugins/localStorage

import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: 'iznik',

      // List the store paths that we want to persist.
      paths: [
        'localization.locale',
        'security',
        'locations',
        'people',
        'slots'
      ],

      reducer: function(state, paths) {
        // Don't store the messages - they're too big, and too transient.
        delete state.messages
        return state
      }
    })(store)
  })
}
