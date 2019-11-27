export const state = () => ({
  scheduke: {}
})

export const mutations = {
  set(state, schedule) {
    state.schedule = schedule
  }
}

export const getters = {
  get: state => () => {
    return state.schedule
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const res = await this.$axios.get(process.env.API + '/schedule', {
      params: params
    })

    if (res.status === 200 && res.data.ret === 0) {
      commit('set', res.data.schedule)
    }
  },

  async update({ commit, dispatch }, params) {
    const ret = await this.$axios.post(process.env.API + '/schedule', params)

    if (ret.status === 200 && ret.data.ret === 0) {
      // Fetch back to update store and thereby components
      await dispatch('fetch', {
        userid: params.userid
      })
    }

    return ret
  }
}
