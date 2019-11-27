import Vue from 'vue'

export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  list: {}
})

export const mutations = {
  addRoom(state, item) {
    Vue.set(state.list, item.id, item)
  },

  setList(state, chats) {
    state.list = {}

    if (chats) {
      for (const chat of chats) {
        Vue.set(state.list, chat.id, chat)
      }
    }
  }
}

export const getters = {
  get: state => id => {
    let ret = null

    Object.keys(state.list).forEach(key => {
      const chat = state.list[key]

      if (parseInt(key) === parseInt(id)) {
        ret = chat
      }
    })

    return ret
  },

  list: state => {
    return state.list
  }
}

export const actions = {
  async listChats({ commit }, params) {
    params = params || {
      chattypes: ['User2User', 'User2Mod'],
      summary: true,
      search: params && params.search ? params.search : null
    }

    const res = await this.$axios.get(process.env.API + '/chat/rooms', {
      params: params
    })

    if (res.status === 200) {
      commit('setList', res.data.chatrooms)
    }
  },

  async openChatToMods({ dispatch, commit }, params) {
    const id = await dispatch('openChat', {
      chattype: 'User2Mod',
      groupid: params.groupid
    })

    return id
  },

  async openChatToUser({ dispatch, commit }, params) {
    const id = await dispatch('openChat', {
      chattype: 'User2User',
      userid: params.userid
    })

    return id
  },

  async openChat({ dispatch, commit }, params) {
    let id = null

    const res = await this.$axios.post(
      process.env.API + '/chat/rooms',
      params,
      {
        headers: {
          'X-HTTP-Method-Override': 'PUT'
        }
      }
    )

    if (res.status === 200) {
      id = res.data.id

      await dispatch('fetch', {
        id: id
      })
    }

    return id
  },

  async fetch({ commit }, params) {
    const chatid = params.id

    if (chatid) {
      const chat = await this.$axios.get(process.env.API + '/chatrooms', {
        params: {
          id: chatid
        }
      })

      if (chat.status === 200 && chat.data.ret === 0) {
        const chatobj = chat.data.chatroom

        if (chatobj) {
          // Valid chatid
          commit('addRoom', chatobj)
        } else {
          // Invalid
          console.error('Invalid chat id', chatid)
        }
      }
    } else {
      console.error("Don't fetch null id")
    }
  },

  async markSeen({ commit, getters, dispatch }, params) {
    const chat = getters.get(params.id)

    if (chat.unseen > 0) {
      // Record that we have seen the last message, and there are no unseen ones left.
      await this.$axios.post(process.env.API + '/chatrooms', {
        id: chat.id,
        lastmsgseen: chat.lastmsg
      })

      await dispatch('fetch', {
        id: params.id
      })
    }
  }
}
