export const state = () => ({
  isiOS: false,
  mobilePushId: 0 // 0=not yet set, 1=no, 2=yes Used by BaseAPI
})

export const mutations = {
  setisiOS(state, isiOS) {
    state.isiOS = isiOS
  },
  setmobilePushId(state, mobilePushId) {
    state.mobilePushId = mobilePushId ? 2 : 1
  },
}

export const getters = {
  isiOS(state) {
    return state.isiOS
  },
  mobilePushId(state) {
    return state.mobilePushId
  },
}
