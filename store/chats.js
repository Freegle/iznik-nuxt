import Vue from 'vue'

export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  list: {},
  currentChat: null,
  fetching: {}
})

export const mutations = {
  addRoom(state, item) {
    // This might be a number and therefore not of string type
    item.snippet = item.snippet + ''

    Vue.set(state.list, parseInt(item.id), item)
  },

  setList(state, chats) {
    if (chats) {
      // We might have chats that have been removed.  Look for ids in our store that are not in the list, and remove
      // them.  This is a common case when blocking a user.
      const existingIds = Object.keys(state.list).map(a => parseInt(a))
      const newIds = chats.map(a => a.id)
      const removed = existingIds.filter(a => !newIds.includes(a))
      removed.forEach(id => {
        Vue.delete(state.list, id)
      })

      for (const chat of chats) {
        // We might have a copy of the chat in store already.  If so, it may have more info than we have fetched
        // this time, so merge it.
        chat.snippet = chat.snippet + ''

        Vue.set(
          state.list,
          parseInt(chat.id),
          Object.assign(state.list[chat.id] || {}, chat)
        )
      }
    }
  },

  currentChat(state, chatid) {
    state.currentChat = chatid
  },

  fetching(state, params) {
    if (!params) {
      state.fetching = {}
    } else {
      state.fetching[params.id] = params.item
    }
  }
}

export const getters = {
  get: state => id => {
    id = parseInt(id)
    return state.list[id] ? state.list[id] : null
  },

  list: state => {
    return state.list
  },

  getByUser: state => userid => {
    let ret = null

    Object.keys(state.list).forEach(key => {
      const chat = state.list[key]

      if (
        parseInt(chat.user1) === parseInt(userid) ||
        parseInt(chat.user2) === parseInt(userid)
      ) {
        ret = chat
      }
    })

    return ret
  },

  unseenCount: state => {
    return Object.values(state.list).reduce(
      (total, chat) => total + chat.unseen,
      0
    )
  },

  currentChat: state => {
    return state.currentChat
  }
}

export const actions = {
  async listChats({ commit, rootGetters, state }, params) {
    const modtools = rootGetters['misc/get']('modtools')

    params = params || {
      chattypes: modtools ? ['User2Mod', 'Mod2Mod'] : ['User2User', 'User2Mod'],
      search: params && params.search ? params.search : null
    }

    params.summary = true

    try {
      let current = null

      // We might have a current chat selected.  We want to make sure that we don't lose it.  This can happen if
      // we search for an old chat that we wouldn't normally return.
      const chatid = parseInt(state.currentChat)
      current = state.list[chatid] ? state.list[chatid] : null

      const chats = await this.$api.chat.listChats(params)

      if (current) {
        const already =
          chats &&
          chats.find(c => {
            return current && parseInt(c.id) === parseInt(current.id)
          })

        if (!already) {
          chats.push(current)
        }
      }

      commit('setList', chats)

      // This avoids us ever getting stuck with bad stuff in the fetching list.
      commit('fetching', null)
    } catch (e) {
      // This happens a lot on mobile when the network is flaky.  It's not necessarily an end-user visible error,
      // so there is no point letting it ripple up to Sentry.
      console.log('Failed to list chats')

      if (!params.noerror) {
        throw e
      }
    }
  },

  async openChatToMods({ dispatch, commit }, params) {
    const id = await dispatch('openChat', {
      chattype: 'User2Mod',
      groupid: params.groupid,
      userid: params.userid
    })

    return id
  },

  async openChatToUser({ dispatch, commit, rootGetters }, params) {
    const modtools = rootGetters['misc/get']('modtools')

    // We migtht have a type override.  Otherwise open a user chat on FD and mod chat on MT.
    const id = await dispatch('openChat', {
      chattype: params.chattype
        ? params.chattype
        : modtools
          ? 'User2Mod'
          : 'User2User',
      groupid: params.groupid,
      userid: params.userid
    })

    return id
  },

  async openChat({ dispatch, commit }, params) {
    const { id } = await this.$api.chat.openChat(params)
    await dispatch('fetch', { id })
    return id
  },

  async fetch({ commit, state }, params) {
    // We have an optimisation to spot if we fetch the same user with the same parameters simultaneously.
    if (
      !state.fetching[params.id] ||
      state.fetching[params.id].params !== JSON.stringify(params)
    ) {
      // Not already fetching, or different params.
      const p = JSON.stringify(params)

      commit('fetching', {
        id: params.id,
        item: {
          promise: this.$api.chat.fetchChat(params.id),
          params: p
        }
      })
    }

    const { chatroom } = await state.fetching[params.id].promise

    if (state.fetching[params.id]) {
      commit('fetching', {
        id: params.id,
        item: null
      })
    }

    if (chatroom) {
      // Valid chatid
      commit('addRoom', chatroom)
    }
  },

  async markSeen({ commit, getters, dispatch }, params) {
    const chat = getters.get(params.id)

    if (chat.unseen > 0) {
      await this.$api.chat.markSeen(chat.id, chat.lastmsg)
      await dispatch('fetch', {
        id: params.id
      })
    }
  },

  async hide({ dispatch, commit }, params) {
    await this.$api.chat.hideChat(params.id)
    await dispatch('listChats')
  },

  async block({ dispatch, commit }, params) {
    await this.$api.chat.blockChat(params.id)
    await dispatch('listChats')
  },

  async unseenCount({ dispatch, commit }) {
    const ret = await this.$api.chat.unseenCount()
    return ret.count
  },

  currentChat({ commit }, params) {
    commit('currentChat', params.chatid)
  }
}
