// Do mobile app Apple login using cordova-plugin-sign-in-with-apple

export function appAppleLogin(callback) {
  const completeLoginCallback = callback
  try {
    if (navigator.connection.type === Connection.NONE) {
      console.log('No connection - please try again later.')
      completeLoginCallback({ status: 'No connection' })
      return
    }

    window.cordova.plugins.SignInWithApple.signin(
      { requestedScopes: [0, 1] },
      function (succ) {
        console.log(succ)
        console.log(succ.identityToken)

        completeLoginCallback(succ)
      },
      function (err) {
        console.error(err)
        completeLoginCallback({ error: err.error+' '+err.code+' '+err.localizedDescription+' '+err.localizedFailureReason})
      }
    )
  } catch (e) {
    console.log('=========appAppleLogin exception', e)
    completeLoginCallback({ error: e.message })
  }
}

export function appAppleLogout() {
  if (process.env.IS_APP) {
    console.log('appAppleLogout DOING NOTHING')
  }
}
