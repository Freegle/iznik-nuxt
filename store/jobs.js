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
    const ret = await this.$api.job.fetch(params)

    if (ret.data) {
      commit('setList', ret.data)
    }
  },

  clear({ commit }) {
    commit('clear')
  }
}
