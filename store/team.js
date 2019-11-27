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
    const team = await this.$api.team.fetch(params)
    console.log('Got', team)
    commit('set', team)
  },

  clear({ commit }) {
    commit('clear')
  }
}
