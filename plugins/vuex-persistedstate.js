// ~/plugins/localStorage

import createPersistedState from 'vuex-persistedstate'
import cloneDeep from 'lodash.clonedeep'

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
        'newsfeed',
        'compose'
      ],

      reducer: function(state, paths) {
        // Don't store the messages - they're too big, and too transient.  Nor the newsfeed for similar reasons.
        // This also means we don't have to worry about how to delete messages which are deleted on the server.
        const newstate = cloneDeep(state)
        delete newstate.messages
        delete newstate.stroll
        delete newstate.newsfeed.newsfeed
        delete newstate.newsfeed.users
        delete newstate.newsfeed.context
        delete newstate.chatmessages

        // Bound number of notifications
        if (
          newstate.notifications &&
          newstate.notifications.list &&
          newstate.notifications.list.length > 20
        ) {
          newstate.notifications.list.length = 20
        }

        // The groupsnear in a postcode only needs the group ids.
        const pc = newstate.compose.postcode

        if (pc) {
          const near = []
          for (const group of pc.groupsnear) {
            near.push({
              id: group.id
            })
          }

          newstate.compose.postcode.groupsnear = near
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
      }
    })(store)
  })
}
