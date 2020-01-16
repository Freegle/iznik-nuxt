// ~/plugins/localStorage

import createPersistedState from 'vuex-persistedstate'
import cloneDeep from 'lodash.clonedeep'
import requestIdleCallback from '~/assets/js/requestIdleCallback'

const STORAGE = localStorage
const STORAGE_KEY = 'iznik'

// We defer setting of state to local storage until we're idle.
let settingState = null
let setInProgress = false

// Some store paths we want to persist, either because they're short or valuable.
//
// It would be nice to keep the first n notifications, chitchat etc.  But we'd need to think about how this
// interacted with infinite scroll to make sure we didn't get stuck on old data.
const keep = [
  'auth',
  'localization.locale',
  'group',
  'chats',
  'popupchats',
  'compose',
  'reply',
  'address',
  'i18n',
  'misc'
]

export default ({ store }) => {
  // Before leaving the page, make sure we save the state
  window.addEventListener('beforeunload', () => {
    if (settingState) STORAGE.setItem(STORAGE_KEY, JSON.stringify(settingState))
  })

  createPersistedState({
    key: STORAGE_KEY,

    storage: STORAGE,

    reducer: function(state, paths) {
      // Earlier we used cloneDeep on the whole thing and then deleted what we didn't need.
      // But cloneDeep is very slow.
      const newstate = {}
      for (const key in state) {
        if (keep.indexOf(key) !== -1) {
          newstate[key] = cloneDeep(state[key])
        }
      }

      if (state.newsfeed) {
        // We don't want to save most newsfeed info, but this controls where we show.
        newstate.newsfeed = {
          area: state.newsfeed.area
        }
      }

      if (newstate.auth) {
        // Don't store the forceLogin, as that can result in the login popup on page refresh.
        delete newstate.auth.forceLogin
      }

      if (state.address) {
        // Don't store the list - long and confidential.
        delete newstate.address.list
      }

      if (state.compose) {
        // Don't remember that we're uploading, else we might get stuck.
        delete newstate.compose.uploading
      }

      // for (const field of Object.keys(newstate)) {
      //   console.log(
      //     'Field',
      //     field,
      //     JSON.stringify(newstate[field]).length,
      //     newstate[field]
      //   )
      // }

      return newstate
    },
    setState: (key, state, storage) => {
      // We change the state a lot, and this can result in many calls to persist it, which kills performance.
      // We don't need it to be sync'd immediately, so we delay it until we're idle, and avoid duplicate requests
      // by overwriting them if we're not yet setting it.
      // console.log('Consider set state', settingState)
      if (settingState) {
        if (!setInProgress) {
          // We're not currently setting the state, we're waiting - so we can overwrite the state we're
          // intending to set with the latest one.  This saves multiple slow calls to set in local storage.
          // console.log('Can overwrite queued')
          settingState = state
        } else {
          // We're in the middle of setting it.  This shouldn't happen because it's done synchronously below.
          console.error('In the middle of setting it')
        }
      } else {
        // We're not already setting it.  Queue it up for when we're idle.
        // console.log('Queue for idle')
        settingState = state

        // We start a timeout.  This is because request idle callback can get called pretty rapidly.  This
        // way we throttle the sets.
        setTimeout(() => {
          requestIdleCallback(() => {
            if (settingState) {
              // console.log('set state now')
              setInProgress = true
              try {
                storage.setItem(key, JSON.stringify(settingState))
              } catch (e) {
                // This is commonly a quota error.  Try saving just the bare essentials we need for handling
                // signin, replies and posting.
                console.log(
                  'Failed to set full state of len',
                  JSON.stringify(settingState).length
                )

                const smallerState = {
                  auth: settingState.auth,
                  compose: settingState.compose,
                  reply: settingState.reply,
                  misc: settingState.misc
                }
                try {
                  storage.setItem(key, JSON.stringify(smallerState))
                } catch (e) {
                  // Plough on regardless and see what happens.  We'll probably get another exception and
                  // fail, but not always.
                  console.error(
                    'Failed to set reduced state of size ',
                    JSON.stringify(smallerState).length
                  )
                }
              }

              setInProgress = false
              settingState = null
              // console.log('completed set state')
            } else {
              // We have already set the latest state in an earlier callback.
              // console.log('Nothing to set')
            }
          })
        }, 5000)
      }
    }
  })(store)
}
