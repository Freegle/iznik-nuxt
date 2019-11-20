import BaseAPI from './BaseAPI'

export default class SessionAPI extends BaseAPI {
  fetch(params) {
    return this.$get(params)
  }

  save(data) {
    return this.$patch(data)
  }

  login({
    email,
    password,
    fblogin,
    fbaccesstoken,
    googlelogin,
    googleauthcode
  }) {
    return this.$post({
      email,
      password,
      fblogin,
      fbaccesstoken,
      googlelogin,
      googleauthcode
    })
  }

  logout() {
    return this.$del()
  }

  forget() {
    return this.$post({ action: 'Forget' })
  }
}
