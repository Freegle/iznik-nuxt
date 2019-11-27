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
    const res = await this.$axios.get(process.env.API + '/dashboard', {
      params: params
    })

    if (res.status === 200) {
      commit('set', res.data.dashboard)
    }
  },

  async fetchHeatmap({ commit }, params) {
    const res = await this.$axios.get(process.env.API + '/dashboard', {
      params: {
        heatmap: true
      }
    })

    if (res.status === 200) {
      commit('setHeatmap', res.data.heatmap)
    }
  },

  clear({ commit }) {
    commit('clear')
  }
}
