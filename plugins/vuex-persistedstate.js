// ~/plugins/localStorage

import createPersistedState from 'vuex-persistedstate'
import cloneDeep from 'lodash.clonedeep'

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
  'i18n'
]

export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: 'iznik',

      reducer: function(state, paths) {
        // Earlier we used cloneDeep on the whole thing and then deleted what we didn't need.
        // But cloneDeep is very slow.
        console.log('Reduce', state)
        const newstate = {}
        for (const key in state) {
          if (keep.indexOf(key) !== -1) {
            console.log('Keep', key)
            newstate[key] = cloneDeep(state[key])
            console.log('Cloned')
          } else {
            console.log('Skip', key)
          }
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
