export const state = () => ({
  replyMsgId: null,
  replyMessage: null,
  replyingAt: null
})

export const mutations = {
  set(state, params) {
    state.replyMsgId = params.replyMsgId
    state.replyMessage = params.replyMessage
    state.replyingAt = params.replyingAt
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
