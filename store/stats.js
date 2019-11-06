import Vue from 'vue'

export const state = () => ({
  Weight: []
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

  clear({ commit }) {
    commit('clear')
  }
}
