export const state = () => ({
  isiOS: false,
  pushAccepted: 0 // 0=not yet set, 1=no, 2=yes Used by BaseAPI
})

export const mutations = {
  setisiOS(state, isiOS) {
    state.isiOS = isiOS
  },
  setpushAccepted(state, mobilePushId) {
    state.pushAccepted = mobilePushId ? 2 : 1
  },
}

export const getters = {
  isiOS(state) {
    return state.isiOS
  },
  pushAccepted(state) {
    return state.pushAccepted
  },
}
