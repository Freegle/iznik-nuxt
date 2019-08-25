export const state = () => ({
  forceLogin: false,
  user: null
})

export const mutations = {
  forceLogin(state, value) {
    state.forceLogin = false
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
    commit('setUser', value)

    // Set or clear our auth token to be used on all API requests.
    this.$axios.defaults.headers.common.Authorization = value
      ? 'Iznik ' + value.persistent
      : null
  },

  async login({ commit }, params) {
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
    } else {
      // Login failed.
      console.error('Login failed', res)
      throw res
    }
  }
}
