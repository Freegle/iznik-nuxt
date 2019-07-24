export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  list: {}
})

export const mutations = {
  add(state, item) {
    console.log(item)
    state.list[item.id] = item
  },

  remove(state, item) {
    state.list[item.id] = null
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

    Object.keys(state.list).forEach(key => {
      const chat = state.list[key]

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
  async fetchChats({ commit }, params) {
    const res = await this.$axios.get(process.env.API + '/chat/rooms', {
      chattypes: ['User2User', 'User2Mod'],
      summary: true
    })

    if (res.status === 200) {
      commit('setList', res.data.chatrooms)
    }
  }
}
