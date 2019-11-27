export const state = () => ({
  replyTo: null,
  replyMessage: null
})

export const mutations = {
  set(state, params) {
    state.replyTo = params.replyTo
    state.replyMessage = params.replyMessage
  }
}

export const getters = {
  get: state => {
    return state
  }
}

export const actions = {
  set({ commit }, params) {
    commit('set', params)
  }
}
