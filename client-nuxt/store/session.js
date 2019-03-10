export const state = () => ({
  loggedin: false,
  location: {}
})

export const mutations = {
  login(state) {
    state.loggedin = true
    console.log('Record logged in')
  },
  logout(state) {
    state.loggedin = false
  }
}

export const actions = {
  async login({ commit }, params) {
    console.log('Login', params)
    const bodyFormData = new FormData()
    bodyFormData.set('_username', params.email)
    bodyFormData.set('_password', params.password)

    await this.$axios({
      method: 'POST',
      url: process.env.API + '/login_check',
      data: bodyFormData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    }).then(res => {
      if (res.status === 200) {
        console.log('Login success')
        commit('login')
        console.log('Committed login')
        this.$router.push('/locations')
      } else {
        console.error(res)
      }
    })
  }
}
