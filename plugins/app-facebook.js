// Needs a tidy up
// Do mobile app Facebook login using auth popup handled within app using cordova-plugin-inappbrowser
// Based on Cordova part of: http://coenraets.org/blog/2014/04/facebook-phonegap-cordova-without-plugin/

const FB_LOGIN_URL = 'https://www.facebook.com/dialog/oauth'
const FB_LOGOUT_URL = 'https://www.facebook.com/logout.php' // DOESN'T WORK
const CordovaOauthRedirectURL = 'https://www.facebook.com/connect/login_success.html' // Must be listed a app redirect URI

class openFB {
  constructor() {
    this.fbAppId = process.env.FACEBOOK_APPID
    this.tokenStore = window.sessionStorage // or could be window.localStorage
    this.loginCallback = false
    this.loginWindow = false
    this.authGiven = false
    this.startTime = new Date().getTime()
  }

  // Inappbrowser load start handler: Used when running in Cordova only
  loginWindowLoadStartHandler(event) {
    const url = event.url
    if (url.indexOf('access_token=') > 0 || url.indexOf('error=') > 0) {
      this.authGiven = true
      const timeout = 600 - (new Date().getTime() - this.startTime)
      setTimeout(() => {
        this.loginWindow.close()
      }, timeout > 0 ? timeout : 0)
      this.oauthCallback(url)
    }
  }

  // Inappbrowser exit handler: Used when running in Cordova only
  // Not normally called
  loginWindowExitHandler() {
    // Handle the situation where the user closes the login window manually before completing the login process
    // deferredLogin.reject({ error: 'user_cancelled', error_description: 'User cancelled login process', error_reason: "user_cancelled" });
    if (this.loginWindow) {
      // this.loginWindow.removeEventListener('loadstart', this.loginWindowLoadStartHandler)
      // sthis.loginWindow.removeEventListener('exit', this.loginWindowExitHandler)
      this.loginWindow.close()
      this.loginWindow = false
    }
    if (!this.authGiven && this.loginCallback) {
      console.log('loginWindowExitHandler reporting authGiven false')
      this.loginCallback({ status: 'not_authorized', error: 'Facebook permission not given or failed' })
    }
  }

  oauthCallback(url) {
    // Parse the OAuth data received from Facebook
    let queryString = false
    let obj = false
    if (url.indexOf('access_token=') > 0) {
      queryString = url.substr(url.indexOf('#') + 1)
      obj = this.parseQueryString(queryString)
      this.tokenStore['fbtoken'] = obj['access_token']
      if (this.loginCallback) this.loginCallback({ status: 'connected', authResponse: { accessToken: obj['access_token'] } })
    } else if (url.indexOf('error=') > 0) {
      queryString = url.substring(url.indexOf('?') + 1, url.indexOf('#'))
      obj = this.parseQueryString(queryString)
      if (this.loginCallback) this.loginCallback({ status: 'not_authorized', error: obj.error })
    } else {
      if (this.loginCallback) this.loginCallback({ status: 'not_authorized' })
    }
  }

  parseQueryString(queryString) {
    const qs = decodeURIComponent(queryString)
    const obj = {}
    const params = qs.split('&')
    params.forEach(function (param) {
      const splitter = param.split('=')
      obj[splitter[0]] = splitter[1]
    })
    return obj
  }

  // Login to Facebook using OAuth.
  // This happens using the In-App Browser: cordova-plugin-inappbrowser
  //
  // @param callback - Callback function to invoke when the login process succeeds
  // @param options - options.scope: The set of Facebook permissions requested

  login(callback, options) {
    let scope = ''

    if (!this.fbAppId) {
      return callback({ status: 'unknown', error: 'Facebook App Id not set.' })
    }

    this.loginCallback = callback

    if (options && options.scope) {
      scope = options.scope
    }

    const oauthRedirectURL = CordovaOauthRedirectURL

    this.loginWindow = cordova.InAppBrowser.open(FB_LOGIN_URL +
        '?client_id=' +
        this.fbAppId +
        '&redirect_uri=' +
        oauthRedirectURL +
        '&response_type=token&scope=' +
        scope,
      '_blank',
      'location=yes,menubar=yes')

    // Listen to URL changes in the InAppBrowser until we get a URL with an access_token or an error
    // Use arrow functions to set this correctly in handlers
    this.loginWindow.addEventListener('loadstart', event => {
      this.loginWindowLoadStartHandler(event)
    })
    this.loginWindow.addEventListener('exit', event => {
      this.loginWindowExitHandler(event)
    })

    // Note: if the app is running in the browser the loginWindow dialog will call back by invoking the
    // oauthCallback() function. See oauthcallback.html for details.
  }
}

let tryingFacebookLogin = false

export function appFacebookLogin(callback) {
  const completeLoginCallback = callback
  try {
    if (navigator.connection.type === Connection.NONE) {
      completeLoginCallback({ status: 'No connection', error: 'Please try again later' })
      return
    }

    if (tryingFacebookLogin) { console.log('trying already'); return }
    tryingFacebookLogin = true

    const openfb = new openFB()
    const options = { scope: 'email' }
    openfb.login( response => {
      tryingFacebookLogin = false
      openfb.loginCallback = false
      if (response.status === 'connected') {
        // Pass accessToken to do login at Freegle
        completeLoginCallback(response)
      } else {
        console.log('openfb.login fail', response) // Facebook permission not given or failed
        completeLoginCallback(response)
      }
    }, options)
  } catch (e) {
    console.log('=========appFacebookLogin exception', e)
    completeLoginCallback({ status: 'app-facebook exception', error: e.message })
  }
}
