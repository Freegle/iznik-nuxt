// ~/plugins/localStorage

import createPersistedState from 'vuex-persistedstate'
import requestIdleCallback from '~/assets/js/requestIdleCallback'

const STORAGE = localStorage
const STORAGE_KEY = 'iznik'

// We defer setting of state to local storage until we're idle.
let settingState = null
let setInProgress = false

// We want to persist a subset of the store.  How we do this affects performance a lot.   The most efficient
// way is to build up a new object with shallow copies of data.  We used to cloneDeep some of the object and
// delete bits of it, which was poor.  This is a data structure that indicates what we want to copy, either
// entirely (null), or excluding some properties, or only including some properties.
const keep = {
  auth: {
    // Don't store the forceLogin, as that can result in the login popup on page refresh.
    // Ensure password not saved to local storage.
    exclude: ['forceLogin']
  },
  group: null,
  chats: null,
  popupchats: null,
  compose: {
    // Don't remember that we're uploading, else we might get stuck.
    exclude: ['uploading']
  },
  reply: null,
  misc: null,
  newsfeed: {
    // We don't want to save most newsfeed info, but this controls where we show.
    include: ['area']
  }
}

function trySaving(storage, settingState) {
  try {
    const serialised = JSON.stringify(settingState)

    // Sometimes we'll get as far as here and end up with something exactly the same as what is already stored.
    // Writing is presumed to be slower than reading, especially mobile, so swap a read for a write in that case.
    if (storage.getItem(STORAGE_KEY) !== serialised) {
      storage.setItem(STORAGE_KEY, serialised)
    }
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
      storage.setItem(STORAGE_KEY, JSON.stringify(smallerState))
    } catch (e) {
      // Plough on regardless and see what happens.  We'll probably get another exception and
      // fail, but not always.
      console.error(
        'Failed to set reduced state of size ',
        JSON.stringify(smallerState).length
      )
    }
  }
}
export default ({ store }) => {
  // Before leaving the page, make sure we save the state
  window.addEventListener('beforeunload', () => {
    console.log('Save state before unload')
    if (settingState) {
      trySaving(STORAGE, settingState)
    }
  })

  createPersistedState({
    key: STORAGE_KEY,

    storage: STORAGE,

    reducer: function(state, paths) {
      const newstate = {}

      for (const key in keep) {
        if (keep[key] === null) {
          // Copy the whole thing.
          newstate[key] = state[key]
        } else if (keep[key].include) {
          newstate[key] = {}

          keep[key].include.forEach(inc => {
            // We want to include this.
            newstate[key][inc] = state[key][inc]
          })
        } else if (keep[key].exclude) {
          newstate[key] = {}

          for (const inc in state[key]) {
            if (keep[key].exclude.indexOf(inc) === -1) {
              // This is not excluded
              newstate[key][inc] = state[key][inc]
            }
          }
        }
      }

      // User is a special case as we want to exclude user.password, and it's not worth making the above code
      // generic enough to handle that.
      if (state.user) {
        newstate.user = {}

        for (const inc in state.user) {
          if (inc !== 'password') {
            newstate.user[inc] = state.user[inc]
          }
        }
      }

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
              trySaving(storage, settingState)
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
