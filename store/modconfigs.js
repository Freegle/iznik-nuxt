export const state = () => ({
  configs: [],

  // We have a current one.  This is so that we can configure it without interfering with our main list until
  // we save it.  This is particularly useful during COVID19 where the server doesn't return the usual configs
  // normally.
  current: null
})

export const mutations = {
  set(state, configs) {
    state.configs = configs
  },

  setCurrent(state, config) {
    state.current = config
  }
}

export const getters = {
  configs: state => {
    return state.configs
  },

  current: state => {
    return state.current
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
  },

  async fetchConfig({ state, commit }, params) {
    const config = await this.$api.modconfigs.fetchConfig(params)

    if (config) {
      commit('setCurrent', config)
    }
  },

  async updateConfig({ state, dispatch }, params) {
    await this.$api.modconfigs.patchConfig(params)
    await dispatch('fetch', {
      id: params.id,
      configuring: true
    })
  }
}
