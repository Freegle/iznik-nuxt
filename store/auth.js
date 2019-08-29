export const state = () => ({
  forceLogin: false,
  user: null
})

export const mutations = {
  forceLogin(state, value) {
    console.log('set forceLogin', value)
    state.forceLogin = value
  },

  setUser(state, user) {
    state.user = user
  }
}

export const getters = {
  forceLogin: state => () => {
    return state.forceLogin
  },

  user: state => () => {
    return state.user
  }
}

export const actions = {
  forceLogin({ commit }, value) {
    commit('forceLogin', value)
  },

  setUser({ commit }, value) {
    console.log('setUser', value)
    commit('setUser', value)

    // Set or clear our auth token to be used on all API requests.
    this.$axios.defaults.headers.common.Authorization = value
      ? 'Iznik ' + value.persistent
      : null
  },

  async login({ commit, dispatch }, params) {
    console.log('Login')
    const res = await this.$axios.post(process.env.API + '/session', params)
    console.log('Returned', res)

    if (res.status === 200 && res.data.ret === 0) {
      console.log('Succeeded')
      // Login no longer required (if it was)
      commit('forceLogin', false)

      // Save the persistent session token.
      res.data.user.persistent = res.data.persistent

      // Login succeeded.  Set the user, which will trigger various rerendering if we were required to be logged in.
      commit('setUser', res.data.user)

      // We need to fetch the user again to get the groups, which aren't returned by the login API.
      dispatch('fetchUser')
    } else {
      // Login failed.
      console.error('Login failed', res)
      throw new Error('Login failed')
    }
  },

  async fetchUser({ commit, store }, params) {
    console.log('Fetch user', store)

    // We're so vain, we probably think this call is about us.
    const res = await this.$axios.get(process.env.API + '/session', {
      params: {
        components: ['me', 'groups']
      }
    })
    console.log('Returned, stored', res)
    if (res.status === 200 && res.data.ret === 0) {
      console.log('Succeeded')
      // Save the persistent session token.
      res.data.me.persistent = res.data.persistent

      // Login succeeded.  Set the user, which will trigger various re-rendering if we were required to be logged in.
      commit('setUser', res.data.me)
    } else {
      // Login failed.
      console.error('Fetch user failed')
      throw new Error('Fetch user failed')
    }
  }
}
