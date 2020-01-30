import BaseAPI from './BaseAPI'

export default class SessionAPI extends BaseAPI {
  fetch(params) {
    return this.$get('/session', params)
  }

  save(data) {
    return this.$patch('/session', data)
  }

  login({
    email,
    password,
    fblogin,
    fbaccesstoken,
    googlelogin,
    googleauthcode,
    mobile, // CC
    appversion, // CC
    u,
    k
  }) {
    return this.$post('/session', {
      email,
      password,
      fblogin,
      fbaccesstoken,
      googlelogin,
      googleauthcode,
      mobile, // CC
      appversion, // CC
      u,
      k
    })
  }

  logout() {
    return this.$del('/session')
  }

  forget() {
    return this.$post('/session', { action: 'Forget' })
  }
}
