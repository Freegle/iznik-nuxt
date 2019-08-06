// ~/plugins/localStorage

import createPersistedState from 'vuex-persistedstate'
import cloneDeep from 'lodash.clonedeep'
import requestIdleCallback from '~/assets/js/requestIdleCallback'

// We defer setting of state to local storage until we're idle.
let settingState = null
let setInProgress = false

export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: 'iznik',

      // List the store paths that we want to persist.
      paths: [
        'localization.locale',
        'security',
        'group',
        'chats',
        'popupchats',
        'newsfeed'
      ],
      //
      reducer: function(state, paths) {
        // Don't store the messages - they're too big, and too transient.  Nor the newsfeed for similar reasons.
        // This also means we don't have to worry about how to delete messages which are deleted on the server.
        // TODO We think this breaks SSR for reasons we don't understand yet.
        const newstate = cloneDeep(state)
        delete newstate.messages
        delete newstate.stroll
        delete newstate.newsfeed.newsfeed
        delete newstate.newsfeed.users
        delete newstate.newsfeed.context
        return newstate
      },

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
