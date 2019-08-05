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
      paths: [
        'localization.locale',
        'security',
        'group',
        'chats',
        'popupchats',
        'newsfeed'
      ],
      //
      // reducer: function(state, paths) {
      //   // Don't store the messages - they're too big, and too transient.
      //   const newstate = cloneDeep(state)
      //   delete newstate.messages
      //   delete newstate.stroll
      //   return newstate
      //
      //   // Want the first bit of the newsfeed.
      //   // Last chat?
      //   reducer breaks stuff so commented out for now TODO
      // }

      setState: (key, state, storage) => {
        console.log('setState')
        if (settingState) {
          if (!setInProgress) {
            // We're not currently setting the state, we're waiting - so we can overwrite the state we're
            // intending to set with the latest one.  This saves multiple slow calls to set in local storage.
            console.log('Not setting')
            settingState = state
          }
        } else {
          // We're not already setting it.  Queue it up for when we're idle.
          console.log('Queue up')
          settingState = state
        }

        requestIdleCallback(() => {
          console.log('Idle')
          if (settingState) {
            console.log('Do set')
            setInProgress = true
            storage.setItem(key, JSON.stringify(state))
            console.log('Done set')
            setInProgress = false
            settingState = null
          }
        })
      }
    })(store)
  })
}
