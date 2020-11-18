import Vue from 'vue'
import union from 'lodash/union'
import uniqWith from 'lodash/uniqWith'
import twem from '~/assets/js/twem'

export const state = () => ({
  list: [],
  context: null,
  unreadCount: 0
})

function compareNotificationIDs(x, y) {
  return x.id === y.id
}

export const mutations = {
  add(state, notifications) {
    if (notifications) {
      // We convert any emoticons here so that they are ready for anyone who uses the store.
      for (const notification of notifications) {
        if (notification.text) {
          notification.text = twem.twem(Vue.$twemoji, notification.text).trim()
        } else if (notification.newsfeed && notification.newsfeed.message) {
          notification.newsfeed.message = twem
            .twem(Vue.$twemoji, notification.newsfeed.message)
            .trim()
        }
      }

      // Ensure we don't have duplicates.  This is unusual code - at the moment we normally clear the store before
      // fetching, but the approach of just fetching and adding means the notifications render rapidly if they are
      // in store and then catch up once the API call has returned.  In general we can't do this without having a
      // way to remove deleted items from the stores, but notifications don't get deleted so it's OK in this case.
      state.list = uniqWith(
        union(state.list, notifications),
        compareNotificationIDs
      )
    }
  },

  setUnreadCount(state, unreadCount) {
    state.unreadCount = unreadCount
  },

  setContext(state, params) {
    state.context = params.ctx
  },

  setList(state, list) {
    state.list = list
  },

  seen(state, id) {
    for (let ix = 0; ix < state.list.length; ix++) {
      if (id === state.list[ix].id) {
        state.list[ix].seen = 1
      }
    }
  }
}

export const getters = {
  getCurrentList: state => {
    return state.list
  },

  getCurrentListInDescendingDateOrder: state => {
    const notifications = state.list

    if (notifications) {
      notifications.sort(function(a, b) {
        return new Date(b.timestamp) - new Date(a.timestamp)
      })
    }

    return notifications
  },

  getContext: state => {
    return state.context
  },

  getUnreadCount: state => {
    return state.unreadCount
  }
}

export const actions = {
  async fetchNextListChunk({ commit, state }, params) {
    const res = await this.$axios.get(process.env.API + '/notification', {
      params: {
        context: state.context
      }
    })

    if (res.status === 200) {
      commit('add', res.data.notifications)

      commit('setContext', {
        ctx: res.data.context ? res.data.context : null
      })
    }
  },

  async updateUnreadNotificationCount({ commit, state, rootGetters }, params) {
    // Check if we're logged in - no point checking for notifications if we're not.
    const me = rootGetters['auth/user']

    if (me) {
      try {
        const res = await this.$axios.get(process.env.API + '/notification', {
          params: {
            count: true
          }
        })

        if (res.status === 200) {
          commit('setUnreadCount', res.data.count)
        }
      } catch (e) {
        // This happens a lot on mobile when the network is flaky.  It's not an end-user visible error, so there
        // is no point letting it ripple up to Sentry.
        console.log('Failed to query notifications')
      }
    }
  },

  // Make sure that the notifications are kept up to date
  async updateNotifications({ dispatch, rootGetters }, params) {
    const me = rootGetters['auth/user']

    if (me && me.id) {
      const currentCount = rootGetters['notifications/getUnreadCount']
      const notifications = rootGetters['notifications/getCurrentList']
      await dispatch('updateUnreadNotificationCount')
      const newCount = rootGetters['notifications/getUnreadCount']

      if (newCount !== currentCount || !notifications.length) {
        // Changed or don't know it yet.  Get the list so that it will display zippily when they click.
        await dispatch('clear')
        await dispatch('fetchNextListChunk')
      }
    }

    // Continuously check for updated notifications. Would be nice if this was event driven instead but requires server work.
    // No need to clear the timeout
    setTimeout(() => {
      dispatch('updateNotifications')
    }, 30000)
  },

  clear({ commit }) {
    commit('setContext', {
      ctx: null
    })

    commit('setList', [])
  },

  clearContext({ commit }) {
    commit('setContext', {
      ctx: null
    })
  },

  async seen({ commit, dispatch }, { id }) {
    commit('seen', id)
    await this.$api.notification.seen(id)
    await dispatch('updateUnreadNotificationCount')
  },

  async allSeen({ dispatch }) {
    await this.$api.notification.allSeen()
    await dispatch('updateUnreadNotificationCount')
  }
}
