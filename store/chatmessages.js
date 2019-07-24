export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  messages: {},
  users: {},
  contexts: {}
})

export const mutations = {
  mergeMessages(state, payload) {
    const chatid = payload.id + ''
    const messages =
      typeof payload.messages === 'object'
        ? Object.values(payload.messages)
        : payload.messages

    console.log('Merge messages', chatid, state.messages, payload.messages)

    state.messages[chatid] = state.messages[chatid]
      ? state.messages[chatid]
      : []

    for (const message of messages) {
      state.messages[chatid][message.id] = message
    }

    console.log('Messages now', chatid, state.messages)
  },

  mergeUsers(state, payload) {
    const chatid = payload.id + ''
    const users =
      typeof payload.users === 'object'
        ? Object.values(payload.users)
        : payload.users
    console.log('Merge users', chatid, state.users, users)

    state.users[chatid] = state.users[chatid] ? state.users[chatid] : []

    for (const user of users) {
      state.users[chatid][user.id] = user
    }

    console.log('Users now', chatid, state.users)
  },

  setContext(state, params) {
    state.contexts[params.id] = params.ctx
    console.log('Context now', params.id, params.ctx)
  }
}

export const getters = {
  getMessages: state => chatid => {
    chatid = chatid + ''
    console.log('Get messages', chatid, state.messages)
    const ret = state.messages[chatid] ? state.messages[chatid] : []
    console.log('Returning', ret)
    return ret
  },

  getUsers: state => chatid => {
    return state.users[chatid] ? state.users[chatid] : []
  },

  getContext: state => id => {
    return state.contexts[id]
  }
}

export const actions = {
  async fetch({ commit, state }, params) {
    const chatid = params.chatid
    console.log('Fetch messages', chatid, this.context)
    const messages = await this.$axios.get(
      process.env.API + '/chat/rooms/' + chatid + '/messages',
      {
        params: {
          limit: 10,
          context: state.contexts[chatid] ? state.contexts[chatid] : null
        }
      }
    )
    console.log('Fetched messages', messages)

    if (messages.status === 200 && messages.data.ret === 0) {
      commit('mergeMessages', {
        id: chatid,
        messages: messages.data.chatmessages
      })
      commit('mergeUsers', {
        id: chatid,
        users: messages.data.chatusers
      })
      commit('setContext', {
        id: chatid,
        ctx: messages.data.context ? messages.data.context : null
      })
    }
  }
}
