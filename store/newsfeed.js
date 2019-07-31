export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  newsfeed: [],
  users: {},
  context: {},
  area: 'nearby'
})

export const mutations = {
  addNewsfeed(state, item) {
    state.newsfeed.unshift(item)
  },

  mergeNewsfeed(state, payload) {
    const items =
      typeof payload.newsfeed === 'object'
        ? Object.values(payload.newsfeed)
        : payload.newsfeed

    for (const item of items) {
      state.newsfeed.push(item)
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
  },

  area(state, payload) {
    state.area = payload.area
  },

  clearFeed(state) {
    state.newsfeed = []
    state.context = {}
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
  },

  getContext: state => () => {
    return state.context
  },

  area: state => id => {
    return state.area
  }
}

export const actions = {
  clearFeed({ commit }, params) {
    commit('clearFeed')
  },

  async fetchFeed({ commit, state }, params) {
    params = params || {}
    if (params.context) {
      // Ensure the context is a real object, in case it has been in the store.
      const ctx = JSON.parse(JSON.stringify(params.context))
      params.context = ctx
    }

    // Ensure the context has the correct distance we want to see.
    params.context.distance = state.area

    params.types = [
      'Message',
      'CommunityEvent',
      'VolunteerOpportunity',
      'Alert',
      'Story',
      'AboutMe',
      'Noticeboard'
    ]

    const res = await this.$axios.get(process.env.API + '/newsfeed', {
      params: params
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
    let newsfeedobj = null

    const newsfeed = await this.$axios.get(process.env.API + '/newsfeed', {
      params: params
    })

    if (newsfeed.status === 200 && newsfeed.data.ret === 0) {
      newsfeedobj = newsfeed.data.newsfeed

      if (newsfeedobj) {
        // Valid id
        commit('addNewsfeed', newsfeedobj)
      }
    }

    return newsfeedobj
  },

  async send({ commit, dispatch }, params) {
    let newsfeedobj = null

    const newsfeed = await this.$axios.post(
      process.env.API + '/newsfeed',
      params
    )

    if (newsfeed.status === 200 && newsfeed.data.ret === 0) {
      const id = newsfeed.data.id

      newsfeedobj = await dispatch('fetch', {
        id: id
      })
    }

    return newsfeedobj
  }
}
