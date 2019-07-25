export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  list: {},
  rooms: {}
})

export const mutations = {
  addRoom(state, item) {
    state.rooms[item.id] = item
  },

  setList(state, chats) {
    state.list = {}
    for (const chat of chats) {
      state.list[chat.id] = chat
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
    const res = await this.$axios.get(process.env.API + '/chat/rooms', {
      params: {
        chattypes: ['User2User', 'User2Mod'],
        summary: true
      }
    })

    if (res.status === 200) {
      commit('setList', res.data.chatrooms)
    }
  },
  async fetch({ commit }, params) {
    const chatid = params.id
    const chat = await this.$axios.get(process.env.API + '/chatrooms', {
      params: {
        id: chatid
      }
    })

    if (chat.status === 200 && chat.data.ret === 0) {
      const chatobj = chat.data.chatroom
      commit('addRoom', chatobj)
    }
  }
}
