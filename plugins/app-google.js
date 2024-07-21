// Do mobile app Google login within app using cordova-plugin-google-signin

import jwt_decode from 'jwt-decode'

let tryingGoogleLogin = false

export function appGoogleLogin(isiOS, callback) {
  const completeLoginCallback = callback
  try {
    if (navigator.connection.type === Connection.NONE) {
      console.log('No connection - please try again later.')
      completeLoginCallback({ status: 'No connection' })
      return
    }

    if (tryingGoogleLogin) { return }

    tryingGoogleLogin = true

    if (isiOS) { // iOS
      console.log("GoogleSignInPlugin.signIn")
      cordova.plugins.GoogleSignInPlugin.signIn(
        function (sdata) {
          const data = JSON.parse(sdata)
          // const decoded = jwt_decode(data.message.id_token)
          // Pass JWT to do login at Freegle
          tryingGoogleLogin = false
          const authResult = { code: data.message.id_token } 
          completeLoginCallback(authResult)
        },
        function (error) {
          console.error(error)
          completeLoginCallback({ status: error.message })
          tryingGoogleLogin = false
        }
      );
    } else { // Android
      console.log("GoogleSignInPlugin.oneTapLogin")
      cordova.plugins.GoogleSignInPlugin.oneTapLogin(
        function (sdata) {
          const data = JSON.parse(sdata)
          console.log("GoogleSignInPlugin.oneTapLogin OK", data)
          // const decoded = jwt_decode(data.message.id_token)
          // Pass JWT to do login at Freegle
          tryingGoogleLogin = false
          const authResult = { code: data.message.id_token }
          completeLoginCallback(authResult)
        },
        function (error) {
          console.log("GoogleSignInPlugin.oneTapLogin ERROR")
          if (typeof error === 'string') error = JSON.parse(error)
          console.log("GoogleSignInPlugin error", error.message)
          //if (error.message === 'One Tap Signin was denied by the user.') {
          //  error.message += ' Reinstall app or wait 24 hours before trying again.'
          //}
          console.log(error)
          completeLoginCallback({ status: error.message })
          tryingGoogleLogin = false
        }
      )
    }
    
  } catch (e) {
    console.log('=========appGoogleLogin exception', e)
    completeLoginCallback({ status: e.message })
    tryingGoogleLogin = false
  }
}

export function appGoogleLogout() {
  if (process.env.IS_APP) {
    console.log('appGoogleLogout start')
    cordova.plugins.GoogleSignInPlugin.signOut(
      function (success) {
        console.log(success);
      },
      function (error) {
        console.error(error);
      }
    );
  }
}
