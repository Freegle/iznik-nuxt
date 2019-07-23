import Vue from 'vue'

export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  list: {},

  ids: [],

  // The context from the last fetch, used for fetchMore.
  context: null
})

export const mutations = {
  add(state, item) {
    state.list[item.id] = item

    if (state.ids.indexOf(item.id) !== -1) {
      state.ids.push(item.id)
    }
  },
  addAll(state, items) {
    items.forEach(item => {
      Vue.set(state.list, item.id, item)

      if (state.ids.indexOf(item.id) === -1) {
        state.ids.push(item.id)
      }
    })
  },
  remove(state, item) {
    state.list[item.id] = null
  },
  setContext(state, ctx) {
    state.context = ctx
  }
}

export const getters = {
  get: state => id => {
    let ret = null

    Object.keys(state.list).forEach(key => {
      console.log('Compare', key, id)
      if (parseInt(key) === parseInt(id)) {
        ret = state.list[id]
      }
    })

    console.log('Get message', id, state.list, ret)
    return ret
  },
  getContext: state => () => {
    return state.context
  },
  getByGroup: state => groupid => {
    const ret = []

    state.ids.forEach(id => {
      const message = state.list[id]
      if (message.groups.length > 0 && message.groups[0].groupid === groupid) {
        ret.push(message)
      }
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
