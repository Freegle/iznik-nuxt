export default {
  namespaced: true,
  state: {
    isLoading: false,
    error: null,
    isAuthenticated: false,
    token: null
  },
  mutations: {
    AUTHENTICATING(state) {
      state.isLoading = true
      state.error = null
      state.isAuthenticated = false
    },
    AUTHENTICATING_SUCCESS(state, token) {
      state.isLoading = false
      state.error = null
      state.isAuthenticated = true

      if (token) {
        state.token = token
      }
    },
    AUTHENTICATING_ERROR(state, error) {
      state.isLoading = false
      state.error = error
      state.isAuthenticated = false
      state.token = null
    },
    LOGOUT(state) {
      state.isLoading = false
      state.error = null
      state.isAuthenticated = false
      state.token = null
    }
  },
  actions: {
    async login({ commit }, params) {
      // We post to the server with the email and password.  If successful this will return a JWT token.
      await this.$axios
        .post(process.env.API + '/login_check', {
          email: params.email,
          password: params.password
        })
        .then(res => {
          if (res.status === 200) {
            // The login succeeded.  Record that, and if we've asked to remember then save our JWT token.
            commit('AUTHENTICATING_SUCCESS', res.data.token)
          } else {
            // The login failed.
            commit('AUTHENTICATING_ERROR')
          }
        })
    },

    logout({ commit }) {
      return new Promise((resolve, reject) => {
        commit('LOGOUT')
        resolve()
      })
    }
  }
}
