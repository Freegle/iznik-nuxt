export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  list: {}
})

export const mutations = {
  add(state, item) {
    state.list[item.id] = item
  },
  addAll(state, items) {
    items.forEach(item => {
      state.list[item.id] = item
    })
  },
  remove(state, item) {
    state.list[item.id] = null
  }
}

export const getters = {
  get: state => id => {
    return state.list.includes(id) ? state.list[id] : null
  },
  getByGroup: state => groupid => {
    const ret = []

    Object.keys(state.list).forEach(key => {
      const message = state.list[key]
      if (message.groups.length > 0 && message.groups[0].groupid === groupid) {
        ret.push(message)
      }
    })

    return ret
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const res = await this.$axios.get(process.env.API + '/messages', {
      params: params
    })

    if (res.status === 200) {
      commit('addAll', res.data.messages)
    }
  }
}
