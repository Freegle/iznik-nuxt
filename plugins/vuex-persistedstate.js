// ~/plugins/localStorage

import createPersistedState from 'vuex-persistedstate'
// import cloneDeep from 'lodash.clonedeep'

// We defer setting of state to local storage until we're idle.
const requestIdleCallback =
  window.requestIdleCallback ||
  (cb => {
    const start = Date.now()
    return setTimeout(() => {
      const data = {
        didTimeout: false,
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start))
        }
      }
      cb(data)
    }, 1)
  })

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
        console.log('Consider set state', settingState)

        if (settingState) {
          console.log('Already setting')
          if (!setInProgress) {
            // We're not currently setting the state, we're waiting - so we can overwrite the state we're
            // intending to set with the latest one.  This saves multiple slow calls to set in local storage.
            console.log('Can overwrite')
            settingState = state
          }
        } else {
          // We're not already setting it.  Queue it up for when we're idle.
          console.log('Queue for idle')
          settingState = state
        }

        requestIdleCallback(() => {
          if (settingState) {
            console.log('set state now')
            setInProgress = true
            storage.setItem(key, JSON.stringify(state))
            setInProgress = false
            settingState = null
            console.log('completed set state')
          } else {
            // We have already set the latest state in an earlier callback.
            console.log('Nothing to set')
          }
        })
      }
    })(store)
  })
}
