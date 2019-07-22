// ~/plugins/localStorage

import createPersistedState from 'vuex-persistedstate'
// import cloneDeep from 'lodash.clonedeep'

export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: 'iznik',

      // List the store paths that we want to persist.
      paths: ['localization.locale', 'security', 'group']
      //
      // reducer: function(state, paths) {
      //   // Don't store the messages - they're too big, and too transient.
      //   const newstate = cloneDeep(state)
      //   delete newstate.messages
      //   delete newstate.stroll
      //   return newstate
      // }
    })(store)
  })
}
