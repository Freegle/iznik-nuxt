import cloneDeep from 'lodash.clonedeep'
import Vue from 'vue'

export const state = () => ({
  // Use array for newsfeed as we need ordering.
  newsfeed: [],
  users: {},
  context: {},
  area: 'nearby'
})

export const mutations = {
  addNewsfeed(state, item) {
    let found = false

    for (let i = 0; i < state.newsfeed.length; i++) {
      if (parseInt(state.newsfeed[i].id) === parseInt(item.id)) {
        // Already there - replace.
        console.log('Already in state', item.id)
        Vue.set(state.newsfeed, i, item)
        found = true
      }
    }

    if (!found) {
      // Just add to head.
      state.newsfeed.unshift(item)
    }
  },

  removeNewsfeed(state, id) {
    state.newsfeed = state.newsfeed.filter(obj => {
      return parseInt(obj.id) !== parseInt(id)
    })
  },

  mergeNewsfeed(state, payload) {
    const items =
      typeof payload.newsfeed === 'object'
        ? Object.values(payload.newsfeed)
        : payload.newsfeed

    if (items) {
      for (const item of items) {
        state.newsfeed.push(item)
      }
    }
  },

  mergeUsers(state, payload) {
    const items =
      typeof payload.users === 'object'
        ? Object.values(payload.users)
        : payload.users

    if (items) {
      for (const item of items) {
        if (state.users[item.id]) {
          // Already there.  Merge in all fields.  This is because we can get users with different levels of
          // info in them (e.g. users in replies have less info) and we don't want to lose info by overwriting.
          state.users[item.id] = Object.assign(state.users[item.id], item)
        } else {
          state.users[item.id] = item
        }
      }
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

function findInReplies(replies, id) {
  let ret = null

  // Look in the replies.
  for (const reply of replies) {
    if (parseInt(reply.id) === parseInt(id)) {
      ret = reply
      break
    }
  }

  if (!ret) {
    // Not found.  Recurse, which is slower.  We don't in practice have deeply nested conversations so we're not
    // going to blow our stack.
    for (const reply of replies) {
      if (reply.replies) {
        ret = findInReplies(reply.replies, id)
      }

      if (ret) {
        break
      }
    }
  }

  return ret
}

export const getters = {
  get: state => id => {
    // This will get any newsfeed item, whether it's a top-level thread, a reply, or a reply to a reply.
    //
    // First look in the top-level entries - quickest
    let ret = state.newsfeed
      ? state.newsfeed.find(item => {
          return parseInt(item.id) === parseInt(id)
        })
      : null

    if (!ret) {
      // Now look in the replies - bit slower.
      for (const item of state.newsfeed) {
        if (item.replies) {
          ret = findInReplies(item.replies, id)

          if (ret) {
            break
          }
        }
      }
    }

    return ret
  },

  newsfeed: state => {
    return state.newsfeed
  },

  users: state => {
    return state.users
  },

  getContext: state => {
    return state.context
  },

  area: state => {
    return state.area
  }
}

export const actions = {
  clearFeed({ commit }, params) {
    commit('clearFeed')
  },

  async fetchFeed({ commit, state }, params) {
    params = params || {
      context: {}
    }

    if (params.context) {
      // Ensure the context is a real object, in case it has been in the store.
      const ctx = cloneDeep(params.context)
      params.context = ctx
    }

    // Ensure the context has the correct distance we want to see.
    params.context = params.context === null ? {} : params.context
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

    const data = await this.$api.news.fetchFeed(params)
    const { users, context } = data

    commit('mergeNewsfeed', data)

    // We get some users back but might miss some in replies.
    commit('mergeUsers', {
      users: users
    })

    if (!params || !params.noContext) {
      commit('setContext', { ctx: context })
    }
  },

  async fetch({ commit }, params) {
    const newsfeed = await this.$api.news.fetch(params)

    if (newsfeed) {
      // Valid id
      commit('addNewsfeed', newsfeed)

      const { user } = newsfeed

      if (user) {
        const users = {}
        users[user.id] = user

        // Also add in any users from replies.
        for (const reply of newsfeed.replies) {
          users[reply.user.id] = reply.user
        }

        commit('mergeUsers', { users })
      }
    }
    return newsfeed
  },

  async send({ commit, dispatch }, params) {
    const id = await this.$api.news.send(params)
    return dispatch('fetch', { id: params.threadhead || id })
  },

  async love({ commit, dispatch }, { id, threadhead }) {
    await this.$api.news.love(id)
    // We fetch the thread head to force a rerender
    await dispatch('fetch', { id: threadhead })
  },

  async unlove({ commit, dispatch }, { id, threadhead }) {
    await this.$api.news.unlove(id)
    // We fetch the thread head to force a rerender
    await dispatch('fetch', { id: threadhead })
  },

  async edit({ commit, dispatch }, { id, message, threadhead }) {
    await this.$api.news.edit(id, message)
    // We fetch the thread head to force a rerender
    await dispatch('fetch', { id: threadhead })
  },

  async delete({ commit, dispatch }, { id, threadhead }) {
    await this.$api.news.del(id)
    if (id !== threadhead) {
      // We fetch the thread head to force a rerender
      await dispatch('fetch', { id: threadhead })
    } else {
      commit('removeNewsfeed', id)
    }
  },

  async unfollow({ commit, dispatch }, { id }) {
    await this.$api.news.unfollow(id)
  },

  async report({ commit, dispatch }, { id, reason }) {
    await this.$api.news.report(id, reason)
  }
}
