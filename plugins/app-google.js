// Do mobile app Google login using auth popup handled within app using cordova-plugin-googleplus

let tryingGoogleLogin = false

export function appGoogleLogin(callback) {
  const completeLoginCallback = callback
  try {
    if (navigator.connection.type === Connection.NONE) {
      console.log('No connection - please try again later.')
      completeLoginCallback({ status: 'No connection' })
      return
    }

    if (tryingGoogleLogin) { return }
    const clientId = process.env.GOOGLE_CLIENT_ID
    console.log('Google clientId: ' + clientId)
    tryingGoogleLogin = true

    // Not needed: window.plugins.googleplus.trySilentLogin(
    window.plugins.googleplus.login(
      {
        // 'scopes': '... ', // optional - space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        webClientId: clientId,
        offline: true // Must be true to get serverAuthCode
      },
      obj => { // SUCCESS
        console.log('google success', obj)
        tryingGoogleLogin = false
        if (!obj.serverAuthCode) {
          completeLoginCallback({ status: 'No serverAuthCode' })
          return
        }
        // Pass accessToken to do login at Freegle
        const authResult = { code: obj.serverAuthCode } // accessToken
        completeLoginCallback(authResult)
      },
      msg => { // ERROR
        console.log('google error: ' + msg)
        tryingGoogleLogin = false
        completeLoginCallback({ status: msg })
      }
    )
  } catch (e) {
    console.log('=========appGoogleLogin exception', e)
    completeLoginCallback({ status: e.message })
  }
}

export function appGoogleLogout() {
  if (process.env.IS_APP) {
    console.log('appGoogleLogout start')
    window.plugins.googleplus.logout(function (msg) {
      console.log('appGoogleLogout done', msg)
    })
  }
}
