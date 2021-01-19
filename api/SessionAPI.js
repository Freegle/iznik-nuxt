import BaseAPI from './BaseAPI'

export default class SessionAPI extends BaseAPI {
  fetch(params) {
    // Add the build date to the session call.  This is used by the server to spot out of date apps, but we need
    // to make it clear that we're not an app at all.
    params.webversion = new Date(process.env.BUILD_DATE).toISOString()
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

  // COVID lockdown 2
  covidConfirmed(msgid) {
    return this.$post('/session', {
      msgid,
      covidconfirmed: true
    })
  }

  related(userlist) {
    return this.$post('/session', {
      action: 'Related',
      userlist: userlist
    })
  }
}
