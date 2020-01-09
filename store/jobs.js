export const state = () => ({
  list: [],
  blocked: false
})

export const mutations = {
  setList(state, list) {
    for (let i = 0; i < list.length; i++) {
      // Get a unique ID.
      const p = list[i].url.lastIndexOf('/')
      const q = list[i].url.indexOf('?')
      list[i].id = list[i].url.substring(p + 1, q)
    }

    state.list = list
  },

  clear(state) {
    state.list = []
  },

  setBlocked(state, value) {
    state.blocked = value
  }
}

export const getters = {
  list: state => {
    return state.list
  },

  blocked: state => {
    return state.blocked
  }
}

export const actions = {
  async fetch({ commit }, params) {
    try {
      commit('setList', await this.$api.job.fetch(params))
      commit('setBlocked', false)
    } catch (e) {
      // Typicall Ad Blockers.
      commit('setBlocked', true)
    }
  },

  clear({ commit }) {
    commit('clear')
  }
}
