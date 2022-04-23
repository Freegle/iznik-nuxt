export const state = () => ({})

export const mutations = {}

export const getters = {}

export const actions = {
  async choose({ commit }, params) {
    const ret = await this.$api.bandit.choose(params)
    return ret.variant ? ret.variant : null
  },

  async shown({ commit, getters, dispatch }, params) {
    await this.$api.bandit.shown(params)
  },

  async chosen({ commit, getters, dispatch }, params) {
    await this.$api.bandit.chosen(params)
  }
}
