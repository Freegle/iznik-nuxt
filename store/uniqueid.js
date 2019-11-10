// Occasionally we need a unique ID on the client.
//
// We use a timestamp plus a counter (since we might generate multiple within the same ms).
export const state = () => ({
  counter: 0
})

export const mutations = {
  inc(state) {
    state.counter++
  }
}

export const actions = {
  generate({ commit, state }) {
    commit('inc')
    const id = new Date().getTime() + '-' + state.counter
    return id
  }
}
