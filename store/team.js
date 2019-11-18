export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  team: null
})

export const mutations = {
  set(state, team) {
    state.team = team
  },

  clear(state) {
    state.team = []
  }
}

export const getters = {
  get: state => {
    return state.team
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const res = await this.$axios.get(process.env.API + '/team', {
      params: params
    })

    if (res.status === 200) {
      console.log('Got', res.data.team)
      commit('set', res.data.team)
    }
  },

  clear({ commit }) {
    commit('clear')
  }
}
