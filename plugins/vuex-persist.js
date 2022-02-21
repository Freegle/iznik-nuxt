import VuexPersistence from 'vuex-persist'
import localForage from 'localforage'
import dayjs from 'dayjs'
import cloneDeep from 'lodash.clonedeep'

import deepmerge from 'deepmerge'

const RETAIN_COUNT = 100
const RETAIN_AGE = 7

let Sentry

if (process.client) {
  Sentry = require('@sentry/browser')
} else {
  Sentry = require('@sentry/node')
}

let giveUp = false

function prune(list) {
  // Prune an object indexed by id on the assumption that the addedToStore field is present, which is maintained
  // by the relevant stores.
  const ret = {}
  const now = dayjs()
  let retained = 0

  if (Object.keys(list).length > RETAIN_COUNT) {
    // Worth pruning.  Retain latest up to our limit.
    for (const id in list) {
      const item = list[id]

      if (
        retained < RETAIN_COUNT &&
        (item.addedToStore &&
          now.diff(dayjs(item.addedToStore), 'days') <= RETAIN_AGE)
      ) {
        ret[id] = item
        retained++
      }
    }

    return ret
  }
}

export default ({ app, store }) => {
  new VuexPersistence({
    key: 'iznik',
    storage: localForage,
    asyncStorage: true,

    filter: function(mutation) {
      if (
        giveUp ||
        mutation.type === 'misc/setTime' ||
        mutation.type === 'chats/fetching' ||
        mutation.type === 'uniqueid/inc'
      ) {
        return false
      }

      // console.log('Mutation', mutation.type)

      return true
    },

    async restoreState(key, storage) {
      // We used to use localStorage to persist the store.  Migrate if present.
      let migratedStorage = null

      try {
        const old = localStorage.getItem('iznik')

        if (old) {
          migratedStorage = JSON.parse(old)

          // Clear so that from now on we use the new format.
          localStorage.removeItem('iznik')

          return Promise.resolve(migratedStorage)
        }
      } catch (e) {
        console.log('Failed to migrate', e)
      }

      // If we don't have to migrate, then we can do the same code from vuex-persist, minus the supportCircular
      // option we don't use.
      const value = await storage.getItem(key)
      const ret =
        typeof value === 'string' ? JSON.parse(value || '{}') : value || {}

      // Ensure the store is not horribly corrupt.
      if (!ret.auth) {
        ret.auth = {
          forceLogin: false,
          user: null,
          userFetched: null,
          groups: [],
          loggedInEver: false,
          userlist: [],
          work: [],
          discourse: {},
          loginType: null
        }
      }

      if (!ret.misc) {
        ret.misc = {
          time: null
        }
      }

      if (!ret.reply) {
        ret.reply = {
          replyMsgId: null,
          replyMessage: null,
          replyingAt: null
        }
      }

      if (!ret.compose) {
        ret.compose = {
          email: null,
          emailAt: null,
          postcode: null,
          group: null,
          messages: {},
          attachments: {},
          progress: 1,
          max: 4,
          uploading: false,
          lastSubmitted: 0
        }
      }

      return ret
    },

    async saveState(key, state, storage) {
      if (giveUp) {
        return
      }

      let newstate = deepmerge({}, state || {}, {
        arrayMerge: (destinationArray, sourceArray, options) => sourceArray
      })

      // This is the minimal state we need to save for functional reasons (e.g. login, compose/reply when logged out).
      const smallerState = {
        auth: newstate.auth,
        compose: newstate.compose,
        reply: newstate.reply,
        misc: newstate.misc
      }

      let quota = null

      try {
        try {
          // Check whether we need to prune more aggressively.  This interface is not supported in all browsers.
          quota = await navigator.storage.estimate()

          if (quota && quota.quota) {
            const length = JSON.stringify(newstate).length

            if (quota.usage < length) {
              newstate = smallerState

              console.log(
                'Aggressive prune from',
                length,
                JSON.stringify(newstate).length,
                quota
              )
            }
          } else {
            // If we don't support quota, let's err on the safe side and save the minimal state.
            newstate = smallerState

            console.log(
              'No quota support 1',
              length,
              JSON.stringify(newstate).length
            )
          }
        } catch (e) {
          // If we don't support quota, let's err on the safe side and save the minimal state.
          newstate = smallerState

          console.log(
            'No quota support 2',
            length,
            JSON.stringify(newstate).length
          )
        }

        await storage.setItem(key, newstate)
      } catch (e) {
        console.log('Storage save failed with', e, quota)
        try {
          await storage.setItem(key, smallerState)
          console.log('...saved smaller')
        } catch (e) {
          // This failed too.  Close the connection and retry.; this can help with some errors.
          console.log(
            'Storage save of smaller failed with',
            e,
            quota,
            JSON.stringify(smallerState).length
          )
          if (storage._dbInfo && storage._dbInfo.db) {
            console.log('Close DB')
            storage._dbInfo.db.close()
          }

          // Retry.
          try {
            await storage.setItem(key, smallerState)
            console.log('...saved smaller after retry')
          } catch (e) {
            console.error(
              'Failed to save smaller after close and retry',
              e,
              quota,
              JSON.stringify(smallerState).length
            )
            Sentry.captureMessage(
              'Failed to save smaller after close and retry ' + e.toString()
            )

            // Don't keep trying, otherwise we generate a lot of Sentry errors.
            giveUp = true
          }
        }
      }
    },

    reducer: function(origstate) {
      const now = dayjs()

      // Shallow copy the state.  This is quick, and decouples the object, whereas cloneDeep on the whole thing is
      // slow.  If we need to manipulate sub-objects then we will cloneDeep them below.
      //
      // This means that we can reduce the state for saving purposes without affecting the current in-memory state.
      let state = Object.assign({}, origstate)

      if (state) {
        const clearPassword = state.user && state.user.password
        const pruneMessages =
          state.messages &&
          state.messages.list &&
          state.messages.index &&
          Object.keys(state.messages.index).length > RETAIN_COUNT
        const pruneChats =
          state.chatmessages &&
          state.chatmessages.messages &&
          state.chatmessages.users &&
          state.chats &&
          state.chats.list &&
          Object.keys(state.chats.list).length > RETAIN_COUNT
        const pruneUsers =
          state.user &&
          state.user.list &&
          Object.keys(state.user.list).length > RETAIN_COUNT
        const pruneGroup =
          state.group &&
          state.group.list &&
          Object.keys(state.group.list).length > RETAIN_COUNT

        if (state.auth && (!state.auth.user || !state.auth.user.id)) {
          // We're not logged in. Clear everything - partly as this might be what the user wants, and also to
          // provide a recovery mechanism if this complex code messes up. Keep the userlist though for anti-spam.
          state = {
            auth: {
              userlist: cloneDeep(state.auth.userlist)
            }
          }
        } else if (clearPassword || pruneMessages || pruneChats || pruneUsers) {
          // Need to deep clone the input state object to avoid any changes we make when pruning affecting the current
          // application store rather than (as we want) the saved copy.  Do this for each thing we need to prune,
          // rather than on the whole thing, as it's expensive.
          if (clearPassword) {
            // Ensure we don't store the password.
            state.user.password = null
          }

          if (pruneMessages) {
            // Keep only the most recent messages, to avoid this growing indefinitely.
            const newmessages = []
            const newindex = {}
            state.messages = cloneDeep(origstate.messages)

            state.messages.list.forEach(m => {
              const arrival =
                m.groups && m.groups.length ? m.groups[0].arrival : m.arrival

              if (
                now.diff(dayjs(arrival), 'days') <= RETAIN_AGE &&
                newmessages.length < RETAIN_COUNT
              ) {
                newmessages.push(m)
                newindex[parseInt(m.id)] = m
              }
            })

            state.messages.list = newmessages
            state.messages.index = newindex
          }

          if (pruneChats) {
            state.chats = cloneDeep(state.chats)
            const sortedChats = store.getters['chats/list']
            const chats = prune(sortedChats)

            // We only want to keep any messages which are referenced from a retained chat.
            const newcontexts = {}
            const newmessages = {}
            const newusers = {}
            const newchats = {}

            for (const id in chats) {
              const c = chats[id]

              newchats[c.id] = c

              if (state.chatmessages.contexts[c.id]) {
                // This will keep messages even if they are deleted on the server.  That's ok, though it would be preferable
                // not to do that.
                newcontexts[c.id] = state.chatmessages.contexts[c.id]
              }

              if (state.chatmessages.messages[c.id]) {
                newmessages[c.id] = state.chatmessages.messages[c.id]
              }

              if (state.chatmessages.users[c.id]) {
                newusers[c.id] = state.chatmessages.users[c.id]
              }
            }

            const modtools = store.getters['misc/get']('modtools')

            if (modtools) {
              // We might also have chat messages for review, which we need to ensure are not pruned.
              for (const chatid in state.chatmessages.messages) {
                let keep = false

                Object.values(state.chatmessages.messages[chatid]).forEach(
                  cm => {
                    if (cm && cm.reviewrequired) {
                      keep = true
                    }
                  }
                )

                if (keep) {
                  newmessages[chatid] = state.chatmessages.messages[chatid]
                }
              }
            }

            state.chats.list = newchats
            state.chatmessages.contexts = newcontexts
            state.chatmessages.messages = newmessages
            state.chatmessages.users = newusers
          }

          if (pruneUsers) {
            // Prune the users.
            state.user = cloneDeep(origstate.user)
            state.user.list = prune(state.user.list)
          }

          if (pruneGroup) {
            // Prune the groups.
            state.group = cloneDeep(origstate.group)
            state.group.list = prune(state.group.list)
          }
        }
      }

      return state
    }
  }).plugin(store)

  // Ensure that the store has been loaded before we render the page.
  app.router.beforeEach(async (to, from, next) => {
    await store.restored
    next()
  })
}
