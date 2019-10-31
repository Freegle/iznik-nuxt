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
  target: state => () => {
    return state.target
  },

  raised: state => () => {
    return state.raised
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const donations = await this.$axios.get(process.env.API + '/donations')

    if (donations.status === 200 && donations.data.ret === 0) {
      commit('set', {
        target: Math.round(parseInt(donations.data.donations.target)),
        raised: Math.round(parseInt(donations.data.donations.raised))
      })
    }
  }
}
