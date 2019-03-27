export const state = () => ({
  list: []
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
  remove(state, { item }) {
    state.list[item.id] = null
  }
}

export const getters = {
  get: state => id => {
    return state.list.includes(id) ? state.list[id] : null
  },
  getByGroup: state => groupid => {
    const ret = []

    state.list.forEach(message => {
      if (message.groups.length > 0 && message.groups[0].id === groupid) {
        ret.push(message)
      }
    })

    return ret
  }
}

export const actions = {
  async fetch({ commit }, params) {
    await this.$axios
      .get(process.env.API + '/messages', {
        params: params
      })
      .then(res => {
        if (res.status === 200) {
          commit('addAll', res.data.messages)
        }
      })
  }
}
