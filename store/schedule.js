export const state = () => ({
  schedule: {}
})

export const mutations = {
  set(state, schedule) {
    state.schedule = schedule
  }
}

export const getters = {
  get: state => () => {
    return state.schedule
  }
}

export const actions = {
  async fetch({ commit }, params) {
    commit('set', await this.$api.schedule.fetch(params))
  },

  async update({ commit, dispatch }, params) {
    await this.$api.schedule.update(params)
    await dispatch('fetch', { userid: params.userid })
  }
}
