import VuexPersistence from 'vuex-persist'
import localForage from 'localforage'

export default ({ app, store }) => {
  new VuexPersistence({
    key: 'iznik',
    storage: localForage,
    asyncStorage: true,

    reducer: function(state) {
      if (state.user) {
        // Ensure we don't store the password.
        state.user.password = null
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
