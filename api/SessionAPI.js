import BaseAPI from './BaseAPI'

export default class SessionAPI extends BaseAPI {
  fetch(params) {
    // Add the build date to the session call.  This is used by the server to spot out of date apps, but we need
    // to make it clear that we're not an app at all.
    params.webversion = process.env.BUILD_DATE
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
    googlejwt, // CC
    mobile, // CC
    appversion, // CC
    applecredentials, // CC
    applelogin, // CC
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
      googlejwt, // CC
      mobile, // CC
      appversion, // CC
      applecredentials, // CC
      applelogin, // CC
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

  related(userlist) {
    return this.$post('/session', {
      action: 'Related',
      userlist: userlist
    })
  }
}
