import Vue from 'vue'
import cloneDeep from 'lodash.clonedeep'

export const state = () => ({
  // Use array because we need to store them in the order returned by the server.
  list: [],

  // But we also want quick access by id.
  index: {},

  viewed: [],

  // The context from the last fetch, used for fetchMore.
  context: null,

  // For spotting when we clear under the feet of an outstanding fetch
  instance: 1
})

export const mutations = {
  add(state, item) {
    if (state.index[parseInt(item.id)]) {
      // Overwrite any existing entry.
      const existing = state.list.findIndex(obj => {
        return parseInt(obj.id) === parseInt(item.id)
      })

      Vue.set(state.list, existing, item)
    } else {
      // We know it doesn't exist - just add to the list.
      state.list.push(item)
    }

    Vue.set(state.index, parseInt(item.id), item)
  },
  addAll(state, items) {
    if (items) {
      items.forEach(item => {
        if (state.index[parseInt(item.id)]) {
          const existing = state.list.findIndex(obj => {
            return parseInt(obj.id) === parseInt(item.id)
          })

          Vue.set(state.list, existing, item)
        } else {
          state.list.push(item)
        }

        Vue.set(state.index, parseInt(item.id), item)
      })
    }
  },
  remove(state, item) {
    state.list = state.list.filter(obj => {
      return parseInt(obj.id) !== parseInt(item.id)
    })

    delete state.index[parseInt(item.id)]
  },
  clear(state) {
    state.list = []
    state.index = {}

    if (state.instance) {
      state.instance++
    } else {
      state.instance = 1
    }
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
    const ret = state.index[parseInt(id)]

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
    // Watch out for the store being cleared under the feet of this fetch. If that happens then we throw away the
    // results.
    const instance = state.instance

    if (params.context) {
      // Ensure the context is a real object, in case it has been in the store.
      const ctx = cloneDeep(params.context)
      params.context = ctx
    } else if (state.context) {
      params.context = state.context
    }

    const { messages, context } = await this.$api.message.fetchMessages(params)

    if (state.instance === instance) {
      commit('addAll', messages)

      if (params.collection !== 'Draft') {
        // We don't use context for drafts - there aren't many.
        commit('setContext', context)
      }
    }
  },

  async fetch({ commit }, params) {
    // Don't log errors on fetches of individual messages
    const instance = state.instance

    const { message, groups } = await this.$api.message.fetch(params, data => {
      return data.ret !== 3
    })

    if (state.instance === instance) {
      // We might have some extra information to add in for this messages which we obtained earlier when searching.
      message.matchedon = params.matchedon

      // Most group info returned on the call we don't care about because it's also in the message.  But whether
      // or not the group is closed matters.
      if (groups) {
        for (const gid in groups) {
          const g = groups[gid]
          if (g.settings && g.settings.closed) {
            message.closed = true
          }
        }
      }

      commit('add', message)
    }
  },

  async update({ commit, dispatch }, params) {
    const data = await this.$api.message.update(params)

    if (!data.deleted) {
      // Fetch back the updated version.
      await dispatch('fetch', { id: params.id })
    }

    return data
  },

  async patch({ commit, dispatch, rootGetters }, params) {
    const data = await this.$api.message.save(params)
    const parms = { id: params.id }

    const modtools = rootGetters['misc/get']('modtools')

    if (modtools) {
      parms.messagehistory = true
    }

    // Clear from store to ensure no attachments.
    commit('remove', {
      id: params.id
    })

    await dispatch('fetch', parms)
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

  clearContext({ commit }) {
    commit('setContext', null)
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

    if (me) {
      const { messages } = await this.$api.message.fetchMessages({
        collection: 'Viewed',
        fromuser: me.id
      })

      commit('setViewed', messages)
    }
  },

  async approve({ commit, dispatch }, params) {
    await this.$api.message.approve(
      params.id,
      params.groupid,
      params.subject,
      params.stdmsgid,
      params.body
    )

    commit('remove', {
      id: params.id
    })

    dispatch(
      'auth/fetchUser',
      {
        components: ['work'],
        force: true
      },
      {
        root: true
      }
    )
  },

  async spam({ commit, dispatch }, params) {
    await this.$api.message.spam(params.id, params.groupid)

    commit('remove', {
      id: params.id
    })

    dispatch(
      'auth/fetchUser',
      {
        components: ['work'],
        force: true
      },
      {
        root: true
      }
    )
  },

  async notspam({ state, commit, dispatch }, params) {
    await this.$api.message.notspam(params.id, params.groupid)

    // Fetch back so that we know whether it's pending or approved and show appropriate buttons.
    dispatch('fetch', {
      id: params.id
    })

    dispatch(
      'auth/fetchUser',
      {
        components: ['work'],
        force: true
      },
      {
        root: true
      }
    )
  },

  async reject({ commit, dispatch }, params) {
    await this.$api.message.reject(
      params.id,
      params.groupid,
      params.subject,
      params.stdmsgid,
      params.body
    )

    commit('remove', {
      id: params.id
    })

    dispatch(
      'auth/fetchUser',
      {
        components: ['work'],
        force: true
      },
      {
        root: true
      }
    )
  },

  async reply({ commit, dispatch }, params) {
    await this.$api.message.reply(
      params.id,
      params.groupid,
      params.subject,
      params.stdmsgid,
      params.body
    )

    dispatch(
      'auth/fetchUser',
      {
        components: ['work'],
        force: true
      },
      {
        root: true
      }
    )
  },

  async delete({ commit, dispatch }, params) {
    await this.$api.message.delete(
      params.id,
      params.groupid,
      params.subject,
      params.stdmsgid,
      params.body
    )

    commit('remove', {
      id: params.id
    })

    dispatch(
      'auth/fetchUser',
      {
        components: ['work'],
        force: true
      },
      {
        root: true
      }
    )
  },

  async hold({ dispatch, commit }, params) {
    await this.$api.message.hold(params.id)
    const { message } = await this.$api.message.fetch({
      id: params.id,
      messagehistory: true
    })
    commit('add', message)
  },

  async release({ dispatch, commit }, params) {
    await this.$api.message.release(params.id)
    const { message } = await this.$api.message.fetch({
      id: params.id,
      messagehistory: true
    })
    commit('add', message)
  },

  async approveedits({ dispatch, commit }, params) {
    await this.$api.message.approveEdits(params.id)

    commit('remove', {
      id: params.id
    })

    dispatch(
      'auth/fetchUser',
      {
        components: ['work'],
        force: true
      },
      {
        root: true
      }
    )
  },

  async revertedits({ dispatch, commit }, params) {
    await this.$api.message.revertEdits(params.id)

    commit('remove', {
      id: params.id
    })

    dispatch(
      'auth/fetchUser',
      {
        components: ['work'],
        force: true
      },
      {
        root: true
      }
    )
  },

  async search({ dispatch, commit }, params) {
    const { messages } = await this.$api.message.fetchMessages({
      subaction: 'searchall',
      search: params.term,
      exactonly: true,
      groupid: params.groupid
    })
    commit('addAll', messages)
  },

  async move({ dispatch, commit }, params) {
    await this.$api.message.update({
      id: params.id,
      groupid: params.groupid,
      action: 'Move'
    })

    await dispatch('fetch', { id: params.id })

    dispatch(
      'auth/fetchUser',
      {
        components: ['work'],
        force: true
      },
      {
        root: true
      }
    )
  },

  async searchMember({ dispatch, commit }, params) {
    const { messages } = await this.$api.message.fetchMessages({
      subaction: 'searchmemb',
      search: params.term,
      groupid: params.groupid
    })
    commit('addAll', messages)
  }
}
