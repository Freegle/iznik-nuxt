const facebookAppId = process.env.FACEBOOK_APPID
let tryingFacebookLogin = false

let FBLoaded = false
let FBLoading = false
let FBDisabled = false

const FB_LOGIN_URL = 'https://www.facebook.com/dialog/oauth'
const FB_LOGOUT_URL = 'https://www.facebook.com/logout.php' // DOESN'T WORK
const CordovaOauthRedirectURL = "https://www.facebook.com/connect/login_success.html" // Must be listed a app redirect URI

let completeLogin = false

function isDisabled() {
  return FBDisabled
}

class openFB {
  constructor() {
    this.fbAppId = false
    this.tokenStore = false
    this.loginCallback = false
    this.loginProcessed = false
  }

  init(params) {
    console.log('openFB: init')
    if (params.appId) {
      this.fbAppId = params.appId
    } else {
      throw new Error('appId parameter not set in init()')
    }

    if (params.tokenStore) {
      this.tokenStore = params.tokenStore
    }
  }

  // /////////////////////////////////////
  // Login to Facebook using OAuth. If running in a Browser, the OAuth workflow happens in a a popup window.
  // If running in Cordova container, it happens using the In-App Browser. Don't forget to install the In-App Browser
  // plugin in your Cordova project: cordova plugins add org.apache.cordova.inappbrowser.
  // 
  // @param callback - Callback function to invoke when the login process succeeds
  // @param options - options.scope: The set of Facebook permissions requested
  // @returns {*}

  login(callback, options) {
    const self = this
    console.log('openFB: login')
    let loginWindow
    const startTime = new Date().getTime()
    let scope = ''

    if (!this.fbAppId) {
      return callback({ status: 'unknown', error: 'Facebook App Id not set.' })
    }

    this.loginCallback = callback
    this.loginProcessed = false

    let authGiven = false

    // Inappbrowser load start handler: Used when running in Cordova only
    function loginWindowLoadStartHandler(event) {
      const url = event.url;
      if (url.indexOf('access_token=') > 0 || url.indexOf('error=') > 0) {
        // When we get the access token fast, the login window (inappbrowser) is still opening with animation
        // in the Cordova app, and trying to close it while it's animating generates an exception. Wait a little...
        authGiven = true
        const timeout = 600 - (new Date().getTime() - startTime)
        setTimeout(function () {
          loginWindow.close()
        }, timeout > 0 ? timeout : 0)
        self.oauthCallback(url)
      }
    }

    // Inappbrowser exit handler: Used when running in Cordova only
    function loginWindowExitHandler() {
      //console.log('exit and remove listeners');
      // Handle the situation where the user closes the login window manually before completing the login process
      //deferredLogin.reject({ error: 'user_cancelled', error_description: 'User cancelled login process', error_reason: "user_cancelled" });
      loginWindow.removeEventListener('loadstop', loginWindowLoadStartHandler)
      loginWindow.removeEventListener('exit', loginWindowExitHandler)
      loginWindow = null
      if (!authGiven) {
        self.loginCallback({ status: 'not_authorized', error: 'Facebook permission not given or failed' })
      }

      //console.log('done removing listeners');
    }

    if (options && options.scope) {
      scope = options.scope
    }

    //        logout();

    const oauthRedirectURL = CordovaOauthRedirectURL

    loginWindow = window.open(FB_LOGIN_URL +
        '?client_id=' +
        this.fbAppId +
        '&redirect_uri=' +
        oauthRedirectURL +
        '&response_type=token&scope=' +
        scope,
      '_blank',
      'location=yes,menubar=yes')

    // Listen to URL changes in the InAppBrowser until we get a URL with an access_token or an error
    loginWindow.addEventListener('loadstart', loginWindowLoadStartHandler)
    loginWindow.addEventListener('exit', loginWindowExitHandler)

    // Note: if the app is running in the browser the loginWindow dialog will call back by invoking the
    // oauthCallback() function. See oauthcallback.html for details.
  }

  oauthCallback(url) {
    // Parse the OAuth data received from Facebook
    this.loginProcessed = true
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
    params.forEach(function(param) {
      const splitter = param.split('=')
      obj[splitter[0]] = splitter[1]
    })
    return obj
  }
}

function fbDone(response) {
  console.log('fbDone!!', response)
  tryingFacebookLogin = false
  //response.status = 'fubared'
  if (response.status === 'connected') {
    console.log('API.post session_login fbauthtoken: ', response.authResponse)
    // Pass accessToken to do actual login
    completeLogin(response)
  } else {
    console.log('fbDone fail', response) // Facebook permission not given or failed
    completeLogin(response)
  }
}

export function appFacebookLogin(callback) {
  try {
    console.log('=========appFacebookLogin')
    completeLogin = callback
    if (navigator.connection.type === Connection.NONE) {
      console.log('appFacebookLogin: No connection - please try again later.')
      completeLogin({ status: 'No connection', error: 'Please try again later' })
      return
    }

    if (tryingFacebookLogin) { console.log('trying already'); return }
    tryingFacebookLogin = true

    const openfb = new openFB()
    const fbTokenStore = window.sessionStorage // or could be window.localStorage
    openfb.init({ appId: facebookAppId, tokenStore: fbTokenStore })
    console.log('Facebook authenticate window open')

    const options = { scope: 'email' }
    openfb.login(fbDone, options)
  } catch (e) {
    console.log('=========appFacebookLogin exception', e)
    completeLogin({ status: 'app-facebook exception', error: e.message })
  }
}
