export const state = () => ({
  isiOS: false
})

export const mutations = {
  setisiOS(state, isiOS) {
    state.isiOS = isiOS
  },
}

export const getters = {
  isiOS(state) {
    return state.isiOS
  },
}
