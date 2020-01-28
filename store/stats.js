import Vue from 'vue'

export const state = () => ({
  Heatmap: null
})

export const mutations = {
  add(state, item) {
    Vue.set(state.list, item.id, item)
  },

  set(state, stats) {
    for (const type in stats) {
      state[type] = []

      for (const ix in stats[type]) {
        Vue.set(state[type], ix, stats[type][ix])
      }
    }
  },

  setHeatmap(state, heatmap) {
    state.Heatmap = heatmap
  },

  clear(state) {
    state = {}
  }
}

export const getters = {
  get: state => type => {
    return state[type]
  }
}

export const actions = {
  async fetch({ commit }, params) {
    // Make sure we have up to date info.
    params.force = true
    commit('set', await this.$api.dashboard.fetch(params))
  },

  async fetchHeatmap({ commit }, params) {
    commit('setHeatmap', await this.$api.dashboard.fetchHeatmap())
  },

  clear({ commit }) {
    commit('clear')
  }
}
