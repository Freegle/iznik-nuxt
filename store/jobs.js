export const state = () => ({
  lastLocation: null,
  lastFetched: null,
  list: [],
  blocked: false
})

export const mutations = {
  setList(state, list) {
    state.list = list
  },

  clear(state) {
    state.list = []
  },

  setBlocked(state, value) {
    state.blocked = value
  },

  setLastLocation(state, location) {
    state.lastFetched = Date.now()
    state.lastLocation = location
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
  async fetch({ state, commit }, params) {
    try {
      const now = Date.now()

      if (
        state.lastFetched &&
        params.location === state.lastLocation &&
        !params.force &&
        now - state.lastFetched < 10 * 60 * 60
      ) {
        // We have fetched jobs in the last few minutes.  No need to fetch again.
      } else {
        commit('setList', await this.$api.job.fetch(params))
        commit('setBlocked', false)
        commit('setLastLocation', params.location)
      }
    } catch (e) {
      // Typically Ad Blockers, though might be an error timeout.
      commit('setBlocked', true)
    }
  },

  clear({ commit }) {
    commit('clear')
  },

  log({ commit }, params) {
    this.$api.job.log(params)
  }
}
