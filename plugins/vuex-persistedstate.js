// ~/plugins/localStorage

import createPersistedState from 'vuex-persistedstate'
import requestIdleCallback from '~/assets/js/requestIdleCallback'

// import cloneDeep from 'lodash.clonedeep'

// We defer setting of state to local storage until we're idle.
let settingState = null
let setInProgress = false

export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: 'iznik',

      // List the store paths that we want to persist.
      paths: ['localization.locale', 'security', 'group', 'chats'],
      //
      // reducer: function(state, paths) {
      //   // Don't store the messages - they're too big, and too transient.
      //   const newstate = cloneDeep(state)
      //   delete newstate.messages
      //   delete newstate.stroll
      //   return newstate
      // }

      setState: (key, state, storage) => {
        if (settingState) {
          if (!setInProgress) {
            // We're not currently setting the state, we're waiting - so we can overwrite the state we're
            // intending to set with the latest one.  This saves multiple slow calls to set in local storage.
            settingState = state
          }
        } else {
          // We're not already setting it.  Queue it up for when we're idle.
          settingState = state
        }

        requestIdleCallback(() => {
          if (settingState) {
            setInProgress = true
            storage.setItem(key, JSON.stringify(state))
            setInProgress = false
            settingState = null
          }
        })
      }
    })(store)
  })
}
