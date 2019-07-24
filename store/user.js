export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  list: {}
})

export const mutations = {
  add(state, item) {
    state.list[item.id] = item
  },

  setList(state, items) {
    state.list = {}
    for (const item of items) {
      state.list[item.id] = item
    }
  }
}

export const getters = {
  get: state => id => {
    let ret = null

    Object.keys(state.list).forEach(key => {
      const item = state.list[key]

      if (parseInt(key) === parseInt(id)) {
        ret = item
      }
    })

    return ret
  },

  list: state => () => {
    return state.list
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const rsp = await this.$axios.get(process.env.API + '/user', {
      params: params
    })

    if (rsp.status === 200 && rsp.data.ret === 0) {
      commit('add', rsp.data.user)
    }
  }
}
