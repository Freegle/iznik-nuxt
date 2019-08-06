export const state = () => ({
  // Use array because we need to store them in the order returned by the server.
  list: [],

  // The context from the last fetch, used for fetchMore.
  context: null
})

export const mutations = {
  add(state, item) {
    // Remove any existing entry.
    // TODO Performance not great.
    state.list = state.list.filter(obj => {
      return parseInt(obj.id) !== parseInt(item.id)
    })

    state.list.push(item)
  },
  addAll(state, items) {
    items.forEach(item => {
      // TODO Performance not great.  Items is short, though, so could take advantage of that.
      state.list = state.list.filter(obj => {
        return parseInt(obj.id) !== parseInt(item.id)
      })

      state.list.push(item)
    })
  },
  remove(state, item) {
    state.list = state.list.filter(obj => {
      return parseInt(obj.id) !== parseInt(item.id)
    })
  },
  setContext(state, ctx) {
    state.context = ctx
  }
}

export const getters = {
  get: state => id => {
    let ret = null

    Object.keys(state.list).forEach(key => {
      if (parseInt(state.list[key].id) === parseInt(id)) {
        ret = state.list[key]
      }
    })

    return ret
  },
  getContext: state => () => {
    return state.context
  },
  getByGroup: state => groupid => {
    const ret = state.list.filter(message => {
      return message.groups.length > 0 && message.groups[0].groupid === groupid
    })

    return ret
  },
  getAll: state => () => {
    return state.list
  }
}

export const actions = {
  async fetchMessages({ commit }, params) {
    if (params.context) {
      // Ensure the context is a real object, in case it has been in the store.
      const ctx = JSON.parse(JSON.stringify(params.context))
      params.context = ctx
    }

    const res = await this.$axios.get(process.env.API + '/messages', {
      params: params
    })

    if (res.status === 200) {
      commit('addAll', res.data.messages)
      commit('setContext', res.data.context)
    }
  },

  async fetch({ commit }, params) {
    const res = await this.$axios.get(process.env.API + '/message', {
      params: params
    })

    commit('add', res.data.message)
  }
}
