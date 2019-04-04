export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  route: [],
  sponsors: []
})

export const mutations = {
  add(state, payload) {
    state.route = payload.route
    state.sponsors = payload.sponsors
  }
}

export const getters = {
  route: state => {
    return state.route
  },
  sponsors: state => {
    return state.sponsors
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const res = await this.$axios.get('https://iznik.modtools.org/api/stroll')

    if (res.status === 200 && res.data.ret === 0) {
      commit('add', {
        route: res.data.route,
        sponsors: res.data.sponsors
      })
    }
  }
}
