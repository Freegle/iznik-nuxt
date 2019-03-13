export default {
  namespaced: true,
  state: {
    isLoading: false,
    error: null,
    isAuthenticated: false,
    roles: []
  },
  getters: {
    isLoading(state) {
      return state.isLoading
    },
    hasError(state) {
      return state.error !== null
    },
    error(state) {
      return state.error
    },
    isAuthenticated(state) {
      return state.isAuthenticated
    },
    hasRole(state) {
      return role => {
        return state.roles.indexOf(role) !== -1
      }
    }
  },
  mutations: {
    AUTHENTICATING(state) {
      console.log('Authenticating')
      state.isLoading = true
      state.error = null
      state.isAuthenticated = false
      state.roles = []
    },
    AUTHENTICATING_SUCCESS(state, roles) {
      console.log('Authenticated')
      state.isLoading = false
      state.error = null
      state.isAuthenticated = true
      state.roles = roles
    },
    AUTHENTICATING_ERROR(state, error) {
      console.log('Authentication failed', error)
      state.isLoading = false
      state.error = error
      state.isAuthenticated = false
      state.roles = []
    },
    PROVIDING_DATA_ON_REFRESH_SUCCESS(state, payload) {
      console.log('Authenticating refresh')
      state.isLoading = false
      state.error = null
      state.isAuthenticated = payload.isAuthenticated
      state.roles = payload.roles
    }
  },
  actions: {
    async login({ commit }, params) {
      console.log('Login', params)
      const bodyFormData = new FormData()
      bodyFormData.set('_username', params.email)
      bodyFormData.set('_password', params.password)

      await this.$axios({
        method: 'POST',
        url: process.env.API + '/login_check',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } },
        redirect: 'manual'
      })
        .then(res => {
          if (res.status === 200) {
            console.log('Login success')
            commit('AUTHENTICATING_SUCCESS')
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
    },

    onRefresh({ commit }, payload) {
      commit('PROVIDING_DATA_ON_REFRESH_SUCCESS', payload)
    }
  }
}
