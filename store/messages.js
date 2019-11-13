import Vue from 'vue'

export const state = () => ({
  // Use array because we need to store them in the order returned by the server.
  list: [],

  // The context from the last fetch, used for fetchMore.
  context: null
})

export const mutations = {
  add(state, item) {
    // Overwrite any existing entry.
    // TODO Performance not great.
    const existing = state.list.findIndex(obj => {
      return parseInt(obj.id) === parseInt(item.id)
    })

    if (existing !== -1) {
      Vue.set(state.list, existing, item)
    } else {
      state.list.push(item)
    }
  },
  addAll(state, items) {
    console.log('AddAll', items)
    items.forEach(item => {
      // TODO Performance not great.  Items is short, though, so could take advantage of that.
      const existing = state.list.findIndex(obj => {
        return parseInt(obj.id) === parseInt(item.id)
      })

      if (existing !== -1) {
        Vue.set(state.list, existing, item)
      } else {
        state.list.push(item)
      }
    })
  },
  remove(state, item) {
    state.list = state.list.filter(obj => {
      return parseInt(obj.id) !== parseInt(item.id)
    })
  },
  clear(state) {
    state.list = []
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
    let ret = null

    if (state.context && state.context.id) {
      ret = state.context
    }

    return ret
  },
  getByGroup: state => groupid => {
    const ret = state.list.filter(message => {
      return (
        message.groups.length > 0 &&
        parseInt(message.groups[0].groupid) === parseInt(groupid)
      )
    })

    return ret
  },
  getAll: state => () => {
    return state.list
  }
}

export const actions = {
  async fetchMessages({ commit, state }, params) {
    if (params.context) {
      // Ensure the context is a real object, in case it has been in the store.
      const ctx = JSON.parse(JSON.stringify(params.context))
      params.context = ctx
    } else if (state.context) {
      params.context = state.context
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
  },

  async update({ commit, dispatch }, params) {
    const ret = await this.$axios.post(process.env.API + '/message', params)

    console.log('Update returned', ret)
    if (ret.status === 200 && ret.data.ret === 0) {
      // Fetch back to update store and thereby components
      console.log('Fetch back')
      await dispatch('fetch', {
        id: params.id
      })
    }

    return ret
  },

  async patch({ commit, dispatch }, params) {
    const ret = await this.$axios.post(process.env.API + '/message', params, {
      headers: {
        'X-HTTP-Method-Override': 'PATCH'
      }
    })

    if (ret.status === 200 && ret.data.ret === 0) {
      // Fetch back to update store and thereby components
      await dispatch('fetch', {
        id: params.id
      })
    }

    return ret
  },

  async promise({ dispatch }, params) {
    await dispatch(
      'update',
      Object.assign(params, {
        action: 'Promise'
      })
    )
  },

  async renege({ dispatch }, params) {
    await dispatch(
      'update',
      Object.assign(params, {
        action: 'Renege'
      })
    )
  },

  clear({ commit }) {
    commit('clear')
  }
}
