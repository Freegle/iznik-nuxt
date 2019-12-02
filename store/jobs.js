export const state = () => ({
  list: []
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
  }
}

export const getters = {
  list: state => {
    return state.list
  }
}

export const actions = {
  async fetch({ commit }, params) {
    try {
      commit('setList', await this.$api.job.fetch(params))
    } catch (e) {
      // If the API call fails, then just don't change the store.
      console.error('Jobs API failed', e)
    }
  },

  clear({ commit }) {
    commit('clear')
  }
}
