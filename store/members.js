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
  updateComments(state, item) {
    Object.keys(state.list).forEach(key => {
      if (parseInt(state.list[key].userid) === parseInt(item.userid)) {
        state.list[key].comments = item.comments
      }
    })
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
      if (
        (parseInt(item.id) && parseInt(item.id) === parseInt(obj.id)) ||
        (parseInt(item.userid) &&
          parseInt(item.userid) === parseInt(obj.userid)) ||
        (parseInt(item.userid) &&
          parseInt(item.userid) === parseInt(obj.relatedto.userid))
      ) {
        return false
      } else {
        return true
      }
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
    const ret = state.list.filter(member => {
      return parseInt(member.groupid) === parseInt(groupid)
    })

    return ret
  },
  getAll: state => {
    return state.list
  }
}

export const actions = {
  async fetchMembers({ commit, state }, params) {
    if (params.context) {
      // Ensure the context is a real object, in case it has been in the store.
      const ctx = cloneDeep(params.context)
      params.context = ctx
    } else if (state.context) {
      params.context = state.context
    }

    const { members, context } = await this.$api.memberships.fetchMembers(
      params
    )

    for (let i = 0; i < members.length; i++) {
      // The server doesn't return the collection but this is useful to have in the store.
      members[i].collection = params.collection
    }

    commit('addAll', members)
    commit('setContext', context)
  },

  async fetch({ commit }, params) {
    // Don't log errors on fetches of individual members
    const { member } = await this.$api.memberships.fetch(params, data => {
      return data.ret !== 3
    })

    commit('add', member)
  },

  async update({ commit, dispatch }, params) {
    const data = await this.$api.memberships.update(params)

    if (!data.deleted) {
      // Fetch back the updated version.
      await dispatch('fetch', { id: params.id })
    }

    return data
  },

  async patch({ commit, dispatch }, params) {
    const data = await this.$api.memberships.save(params)
    await dispatch('fetch', { id: params.id })
    return data
  },

  async updateChat({ dispatch }, userid) {
    // Find the chat to this user and refetch the members, so that if we have a chat window open or other data
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
      'chatmembers/clearContext',
      {
        chatid: chatid
      },
      {
        root: true
      }
    )

    await dispatch(
      'chatmembers/fetch',
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

  async approve({ commit }, params) {
    await this.$api.memberships.approve(
      params.id,
      params.groupid,
      params.subject,
      params.stdmsgid,
      params.body
    )
    commit('remove', {
      id: params.id
    })
  },

  async spam({ commit }, params) {
    await this.$api.memberships.spam(params.id, params.groupid)
    commit('remove', {
      id: params.id
    })
  },

  async reject({ commit }, params) {
    await this.$api.memberships.reject(
      params.id,
      params.groupid,
      params.subject,
      params.stdmsgid,
      params.body
    )
    commit('remove', {
      id: params.id
    })
  },

  async reply({ commit }, params) {
    await this.$api.memberships.reply(
      params.id,
      params.groupid,
      params.subject,
      params.stdmsgid,
      params.body
    )
  },

  async delete({ commit }, params) {
    // Delete pending member.

    await this.$api.memberships.delete(
      params.id,
      params.groupid,
      params.subject,
      params.stdmsgid,
      params.body
    )
    commit('remove', {
      id: params.id
    })
  },

  async remove({ commit }, params) {
    // Remove approved  member.

    await this.$api.memberships.remove(params.userid, params.groupid)

    commit('remove', {
      userid: params.userid
    })
  },

  async ban({ commit }, params) {
    // Ban member.
    await this.$api.memberships.ban(params.userid, params.groupid)

    commit('remove', {
      userid: params.userid
    })
  },

  async purge({ commit }, params) {
    await this.$api.user.purge(params.userid)

    commit('remove', {
      userid: params.userid
    })
  },

  async askMerge({ commit }, params) {
    await this.$api.merge.ask(params)

    commit('remove', {
      userid: params.user1
    })
  },

  async ignoreMerge({ commit }, params) {
    await this.$api.merge.ignore(params)

    commit('remove', {
      userid: params.user1
    })
  },

  updateComments({ commit }, params) {
    commit('updateComments', params)
  }
}
