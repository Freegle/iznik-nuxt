import Vue from 'vue'
import cloneDeep from 'lodash.clonedeep'

export const state = () => ({
  // Use array because we need to store them in the order returned by the server.
  list: [],

  // The context from the last fetch, used for fetchMore.
  context: null
})

export const mutations = {
  add(state, item) {
    // Overwrite any existing entry.
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
    items.forEach(item => {
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
  getContext: state => {
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
  getAll: state => {
    return state.list
  }
}

export const actions = {
  async fetchMessages({ commit, state }, params) {
    if (params.context) {
      // Ensure the context is a real object, in case it has been in the store.
      const ctx = cloneDeep(params.context)
      params.context = ctx
    } else if (state.context) {
      params.context = state.context
    }

    const { messages, context } = await this.$api.message.fetchMessages(params)
    commit('addAll', messages)
    commit('setContext', context)
  },

  async fetch({ commit }, params) {
    const { message } = await this.$api.message.fetch(params)
    commit('add', message)
  },

  async update({ commit, dispatch }, params) {
    const data = await this.$api.message.update(params)
    await dispatch('fetch', { id: params.id })
    return data
  },

  async patch({ commit, dispatch }, params) {
    const data = await this.$api.message.save(params)
    await dispatch('fetch', { id: params.id })
    return data
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
