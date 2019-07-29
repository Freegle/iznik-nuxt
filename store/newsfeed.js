export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  newsfeed: {},
  users: {},
  context: {}
})

export const mutations = {
  addNewsfeed(state, item) {
    state.newsfeed[item.id] = item
  },

  mergeNewsfeed(state, payload) {
    const items =
      typeof payload.newsfeed === 'object'
        ? Object.values(payload.newsfeed)
        : payload.newsfeed

    for (const item of items) {
      state.newsfeed[item.id] = item
    }
  },

  mergeUsers(state, payload) {
    const items =
      typeof payload.users === 'object'
        ? Object.values(payload.users)
        : payload.users

    for (const item of items) {
      state.users[item.id] = item
    }
  },

  setContext(state, params) {
    state.context = params.ctx
  }
}

export const getters = {
  get: state => id => {
    let ret = null

    Object.keys(state.list).forEach(key => {
      const entry = state.list[key]

      if (parseInt(key) === parseInt(id)) {
        ret = entry
      }
    })

    return ret
  },

  newsfeed: state => () => {
    return state.newsfeed
  },

  users: state => () => {
    return state.users
  }
}

export const actions = {
  async fetchFeed({ commit }, params) {
    const res = await this.$axios.get(process.env.API + '/newsfeed', {
      params: {
        types: [
          'Message',
          'CommunityEvent',
          'VolunteerOpportunity',
          'Alert',
          'Story',
          'AboutMe',
          'Noticeboard'
        ]
      }
    })

    if (res.status === 200) {
      commit('mergeNewsfeed', res.data)
      commit('mergeUsers', res.data)

      if (!params || !params.noContext) {
        commit('setContext', {
          ctx: res.data.context ? res.data.context : null
        })
      }
    }
  },
  async fetch({ commit }, params) {
    const id = params.id
    const newsfeed = await this.$axios.get(process.env.API + '/newsfeed', {
      params: {
        id: id
      }
    })

    if (newsfeed.status === 200 && newsfeed.data.ret === 0) {
      const newsfeedobj = newsfeed.data.chatroom

      if (newsfeedobj) {
        // Valid id
        commit('add', newsfeedobj)
      } else {
        // Invalid - go to list
        this.$router.push('/chitchat')
      }
    }
  }
}
