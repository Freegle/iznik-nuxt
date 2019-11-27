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
    const { id } = await this.$api.chat.openChat(params)
    await dispatch('fetch', { id })
    return id
  },

  async fetch({ commit }, { id: chatid }) {
    if (!chatid) return
    const { chatroom } = await this.$api.chat.fetchRoom(chatid)
    if (chatroom) {
      // Valid chatid
      commit('addRoom', chatroom)
    } else {
      // Invalid
      console.error('Invalid chat id', chatid)
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
  }
}
