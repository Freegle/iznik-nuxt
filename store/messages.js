import Vue from 'vue'
import cloneDeep from 'lodash.clonedeep'

export const state = () => ({
  // Use array because we need to store them in the order returned by the server.
  list: [],

  viewed: [],

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
  },
  setViewed(state, viewed) {
    state.viewed = viewed
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
  },
  getViewed: state => {
    return state.viewed
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

    if (!data.deleted) {
      // Fetch back the updated version.
      await dispatch('fetch', { id: params.id })
    }

    return data
  },

  async patch({ commit, dispatch }, params) {
    const data = await this.$api.message.save(params)
    await dispatch('fetch', { id: params.id })
    return data
  },

  async updateChat({ dispatch }, userid) {
    // Find the chat to this user and refetch the messages, so that if we have a chat window open or other data
    // that depends on it, we update that.
    const chatid = await dispatch(
      'chats/openChatToUser',
      {
        userid: userid
      },
      {
        root: true
      }
    )

    await dispatch(
      'chatmessages/clearContext',
      {
        chatid: chatid
      },
      {
        root: true
      }
    )

    await dispatch(
      'chatmessages/fetch',
      {
        chatid: chatid
      },
      {
        root: true
      }
    )
  },

  async promise({ dispatch }, params) {
    await dispatch(
      'update',
      Object.assign(params, {
        action: 'Promise'
      })
    )

    await dispatch('updateChat', params.userid)
  },

  async renege({ dispatch }, params) {
    await dispatch(
      'update',
      Object.assign(params, {
        action: 'Renege'
      })
    )

    await dispatch('updateChat', params.userid)
  },

  clear({ commit }) {
    commit('clear')
    commit('setContext', null)
  },

  async intend({ dispatch }, params) {
    await this.$api.message.intend(params.id, params.outcome)
  },

  async view({ dispatch }, params) {
    await this.$api.message.view(params.id)
  },

  async fetchViewed({ commit, rootGetters }) {
    const me = rootGetters['auth/user']

    const { messages } = await this.$api.message.fetchMessages({
      collection: 'Viewed',
      fromuser: me.id
    })

    commit('setViewed', messages)
  }
}
