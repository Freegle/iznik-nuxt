// Do mobile app Google login using auth popup handled within app using cordova-plugin-googleplus

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
          console.log("data", data)
          console.log(data.message.id_token)
          const decoded = jwt_decode(data.message.id_token)
          console.log(decoded)
  
          // Pass JWT to do login at Freegle
          const authResult = { code: data.message.id_token } 
          console.log("CALLING1")
          completeLoginCallback(authResult)
          console.log("CALLING2")
          tryingGoogleLogin = false
        },
        function (error) {
          console.error(error)
          completeLoginCallback({ status: e.message })
          tryingGoogleLogin = false
        }
      );
    } else { // Android
      console.log("Try one-tap login")
      cordova.plugins.GoogleSignInPlugin.oneTapLogin(
        function (sdata) {
          console.log("success", sdata)
          const data = JSON.parse(sdata)
          console.log("data", data)
          console.log(data.message.id_token)
          const decoded = jwt_decode(data.message.id_token)
          console.log(decoded)
          tryingGoogleLogin = false
          const authResult = { code: data.message.id_token }
          completeLoginCallback(authResult)
        },
        function (error) {
          console.error(error)
          completeLoginCallback({ status: e.message })
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
