import Vue from 'vue'

export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  list: {},
  rooms: {}
})

export const mutations = {
  addRoom(state, item) {
    Vue.set(state.rooms, item.id, item)
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

    Object.keys(state.rooms).forEach(key => {
      const chat = state.rooms[key]

      if (parseInt(key) === parseInt(id)) {
        ret = chat
      }
    })

    return ret
  },

  list: state => () => {
    return state.list
  }
}

export const actions = {
  async listChats({ commit }, params) {
    params = params || {
      chattypes: ['User2User', 'User2Mod'],
      summary: true
    }

    const res = await this.$axios.get(process.env.API + '/chat/rooms', {
      params: params
    })

    if (res.status === 200) {
      commit('setList', res.data.chatrooms)
    }
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
