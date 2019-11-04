export const state = () => ({
  list: []
})

export const mutations = {
  setList(state, list) {
    state.list = list
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
