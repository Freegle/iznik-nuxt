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
  list: state => () => {
    return state.list
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const res = await this.$axios.get('/adview.php', {
      params: params
    })

    if (res.status === 200) {
      commit('setList', res.data.data)
    }
  },

  clear({ commit }) {
    commit('clear')
  }
}
