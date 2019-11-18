import Vue from 'vue'
import twem from '~/assets/js/twem'

export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  list: [],
  context: null,
  count: 0
})

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
      state.list = [...state.list, ...notifications]
    }
  },

  setCount(state, count) {
    state.count = count
  },

  setContext(state, params) {
    state.context = params.ctx
  },

  setList(state, list) {
    state.list = list
  },

  seen(state, id) {
    console.log('Seen', id)
    for (let ix = 0; ix < state.list.length; ix++) {
      console.log('Compare', state.list[ix].id)
      if (id === state.list[ix].id) {
        console.log('Found')
        state.list[ix].seen = 1
      }
    }
  }
}

export const getters = {
  list: state => {
    return state.list
  },

  getContext: state => {
    return state.context
  },

  count: state => {
    return state.count
  }
}

export const actions = {
  async list({ commit, state }, params) {
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

  async count({ commit, state, rootGetters }, params) {
    // Check if we're logged in - no point checking for notifications if we're not.
    const me = rootGetters['auth/user']

    if (me) {
      const res = await this.$axios.get(process.env.API + '/notification', {
        params: {
          count: true
        }
      })

      if (res.status === 200) {
        commit('setCount', res.data.count)
      }
    }
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

  async seen({ commit, dispatch }, params) {
    commit('seen', params.id)

    await this.$axios.post(process.env.API + '/notification', {
      id: params.id,
      action: 'Seen'
    })

    await dispatch('count')
  },

  async allSeen({ commit, dispatch }, params) {
    await this.$axios.post(process.env.API + '/notification', {
      action: 'AllSeen'
    })

    await dispatch('count')
  }
}
