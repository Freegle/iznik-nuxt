export const state = () => ({
  configs: []
})

export const mutations = {
  set(state, configs) {
    state.configs = configs
  }
}

export const getters = {
  configs: state => {
    return state.configs
  }
}

export const actions = {
  async fetch({ state, commit }, params) {
    const { configs } = await this.$api.session.fetch({
      components: ['configs'],
      modtools: true
    })

    if (configs) {
      commit('set', configs)
    }
  }
}
