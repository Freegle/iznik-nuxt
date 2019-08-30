import Vue from 'vue'

export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  messages: {},
  users: {},
  contexts: {}
})

export const mutations = {
  clearMessages(state) {
    Object.assign(state.messages, {})
  },

  mergeMessages(state, payload) {
    const chatid = payload.id + ''
    const messages =
      typeof payload.messages === 'object'
        ? Object.values(payload.messages)
        : payload.messages

    if (!state.messages[chatid]) {
      Vue.set(state.messages, chatid, [])
    }

    for (const message of messages) {
      Vue.set(state.messages[chatid], message.id, message)
    }
  },

  mergeUsers(state, payload) {
    const chatid = payload.id + ''
    const users =
      typeof payload.users === 'object'
        ? Object.values(payload.users)
        : payload.users

    if (!state.users[chatid]) {
      Vue.set(state.users, chatid, [])
    }

    for (const user of users) {
      Vue.set(state.users[chatid], user.id, user)
    }
  },

  setContext(state, params) {
    Vue.set(state.contexts, params.id, params.ctx)
  }
}

export const getters = {
  getMessages: state => chatid => {
    chatid = chatid + ''
    const ret = state.messages[chatid] ? state.messages[chatid] : []
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
  clearMessages({ commit, state }, params) {
    commit('clearMessages')
  },

  async fetch({ commit, state }, params) {
    const chatid = params.chatid
    const messages = await this.$axios.get(
      process.env.API + '/chat/rooms/' + chatid + '/messages',
      {
        params: {
          limit: 30,
          context:
            !params.noContext && state.contexts[chatid]
              ? state.contexts[chatid]
              : null
        }
      }
    )

    if (messages.status === 200 && messages.data.ret === 0) {
      commit('mergeMessages', {
        id: chatid,
        messages: messages.data.chatmessages
      })
      commit('mergeUsers', {
        id: chatid,
        users: messages.data.chatusers
      })

      if (!params.noContext) {
        commit('setContext', {
          id: chatid,
          ctx: messages.data.context ? messages.data.context : null
        })
      }
    }
  },

  async send({ commit, dispatch }, params) {
    params.modtools = process.env.MODTOOLS

    await this.$axios.post(process.env.API + '/chatmessages', params)

    // Get the latest messages back.  Passing no context will fetch the latest.
    await dispatch('fetch', {
      chatid: params.roomid,
      noContext: true
    })
  }
}
