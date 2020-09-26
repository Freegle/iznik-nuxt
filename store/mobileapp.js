export const state = () => ({
  isiOS: false
})

export const mutations = {
  setisiOS(state, isiOS) {
    console.log('mobileapp: isiOS', isiOS)
    state.isiOS = isiOS
  },
}

export const getters = {
  isiOS(state) {
    console.log('mobileapp: get isiOS', state.isiOS)
    return state.isiOS
  },
}
