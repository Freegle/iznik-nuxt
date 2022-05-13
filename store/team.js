export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  team: null,
  teams: []
})

export const mutations = {
  set(state, team) {
    state.team = team
  },

  clear(state) {
    state.team = []
  },

  setTeams(state, list) {
    console.log('Set teams', list)
    state.teams = list
  }
}

export const getters = {
  get: state => {
    return state.team
  },

  list: state => {
    return state.teams
  }
}

export const actions = {
  async fetch({ commit }, params) {
    if (params) {
      const team = await this.$api.team.fetch(params)
      commit('set', team)
    } else {
      const teams = await this.$api.team.fetch()
      commit('setTeams', teams)
    }
  },
  async remove({ commit, dispatch }, params) {
    await this.$api.team.remove(params.id, params.userid)
    await dispatch('fetch', {
      id: params.id
    })
  },
  async add({ commit, dispatch }, params) {
    await this.$api.team.add(params.id, params.userid)
    await dispatch('fetch', {
      id: params.id
    })
  },
  clear({ commit }) {
    commit('clear')
  }
}
