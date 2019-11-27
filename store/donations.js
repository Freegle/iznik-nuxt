export const state = () => ({
  target: 2000,
  raised: 0
})

export const mutations = {
  set(state, params) {
    state.target = params.target
    state.raised = params.raised
  }
}

export const getters = {
  target: state => {
    return state.target
  },

  raised: state => {
    return state.raised
  }
}

export const actions = {
  async fetch({ commit }, params) {
    console.log('Fetch donations', params)
    commit('set', await this.$api.donations.fetch(params.groupid))
  }
}
