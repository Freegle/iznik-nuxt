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
      console.log('Authenticating')
      state.isLoading = true
      state.error = null
      state.isAuthenticated = false
    },
    AUTHENTICATING_SUCCESS(state, token) {
      console.log('Authenticated')
      state.isLoading = false
      state.error = null
      state.isAuthenticated = true

      if (token) {
        state.token = token
      }
    },
    AUTHENTICATING_ERROR(state, error) {
      console.log('Authentication failed', error)
      state.isLoading = false
      state.error = error
      state.isAuthenticated = false
      state.token = null
    }
  },
  actions: {
    async login({ commit }, params) {
      console.log('Login', params)

      await this.$axios
        .post(process.env.API + '/login_check', {
          email: params.email,
          password: params.password
        })
        .then(res => {
          if (res.status === 200) {
            // The login succeeded.  Save our JWT token.

            console.log('Login success', res)
            commit('AUTHENTICATING_SUCCESS', res.data.token)
            console.log('Committed login')
          } else {
            console.error(res)
            commit('AUTHENTICATING_ERROR')
          }
        })
        .catch(err => {
          console.log('Login failed', err)
          commit('AUTHENTICATING_ERROR')
        })
    },

    async logout({ commit }) {
      console.log('Logout')
      await this.$axios.get(process.env.API + '/logout').then(res => {
        console.log('Logout returned', res)
        commit('AUTHENTICATING')
      })
    }
  }
}
