import VuexPersistence from 'vuex-persist'
import localForage from 'localforage'
import dayjs from 'dayjs'
import cloneDeep from 'lodash.clonedeep'

const RETAIN_COUNT = 100
const RETAIN_AGE = 7

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
        mutation.type === 'misc/setTime' ||
        mutation.type === 'uniqueid/inc'
      ) {
        return false
      }

      console.log('Mutation', mutation.type)

      return true
    },

    reducer: function(origstate) {
      const now = dayjs()

      // Need to deep clone the input state object to avoid any changes we make when pruning affecting the current
      // application store rather than (as we want) the saved copy.
      const state = cloneDeep(origstate)

      if (state.user) {
        // Ensure we don't store the password.
        state.user.password = null
      }

      // TODO STORE If logged out, clear everything except userlist.

      if (
        state.messages &&
        state.messages.list &&
        state.messages.index &&
        Object.keys(state.messages.index).length > RETAIN_COUNT
      ) {
        // Keep only the most recent messages, to avoid this growing indefinitely.
        const newmessages = []
        const newindex = {}

        state.messages.list.forEach(m => {
          const arrival =
            m.groups && m.groups.length ? m.groups[0].arrival : m.arrival

          if (now.diff(dayjs(arrival), 'days') <= 7) {
            newmessages.push(m)
            newindex[parseInt(m.id)] = m
          }
        })

        state.messages.list = newmessages
        state.messages.index = newindex
      }

      if (
        state.chatmessages &&
        state.chatmessages.messages &&
        state.chatmessages.users &&
        state.chats &&
        state.chats.list &&
        Object.keys(state.chats.list).length > RETAIN_COUNT
      ) {
        // Prune the chats.
        const chats = prune(state.chats.list)

        // We only want to keep any messages which are referenced from a retained chat.
        const newcontexts = {}
        const newmessages = {}
        const newusers = {}

        for (const id in chats) {
          const c = chats[id]

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

        state.chatmessages.contexts = newcontexts
        state.chatmessages.messages = newmessages
        state.chatmessages.users = newusers
      }

      if (
        state.user &&
        state.user.list &&
        Object.keys(state.user.list).length > RETAIN_COUNT
      ) {
        // Prune the users.
        state.user.list = prune(state.user.list)
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
