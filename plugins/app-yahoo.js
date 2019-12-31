// Do mobile app Yahoo login using auth popup handled within app using cordova-plugin-inappbrowser

function extractQueryStringParams(url) {
  let urlParams = false
  const qm = url.indexOf('?')
  if (qm >= 0) {
    const qs = url.substring(qm + 1)
    // http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    const pl = /\+/g  // Regex for replacing addition symbol with a space
    const search = /([^&=]+)=?([^&]*)/g
    const decode = s => { return decodeURIComponent(s.replace(pl, " ")) }
    urlParams = {}
    let match
    while ((match = search.exec(qs))) {
      urlParams[decode(match[1])] = decode(match[2])
    }
  }
  return urlParams
}

let tryingYahooLogin = false

export function appYahooLogin(yauthurl) {
  console.log('appYahooLogin: ' + yauthurl)

  let authGiven = false

  const authWindow = cordova.InAppBrowser.open(yauthurl, '_blank', 'location=yes,menubar=yes')
  authWindow.addEventListener('loadstart', e => {
    console.log('yloadstart: ', e)
    if (e.url) {
      console.log('yloadstart url: ', e.url)
    }

    if (e && e.originalEvent && e.originalEvent.url) {
      const url = e.originalEvent.url
      console.log('yloadstart originalEvent.url: ' + url)

      // Catch redirect after auth back to ilovefreegle
      if (
        url.indexOf('https://www.ilovefreegle.org/') === 0 ||
        url.indexOf('https://iznik.ilovefreegle.org/') === 0 ||
        url.indexOf('https://fdnuxt.ilovefreegle.org/') === 0
      ) {
        authWindow.close()
        const urlParams = extractQueryStringParams(url)
        if (urlParams) {
          authGiven = true
          urlParams.yahoologin = true
          console.log(urlParams)

          // Try logging in again at FD
          console.log('Got URL params', urlParams)
          /* $.ajax({
            url: API + 'session',
            type: 'POST',
            data: urlParams,
            success: function (response) {
              console.log("Session login returned", response);
              if (response.ret === 0) {
                trigger('loggedIn', response)
                Router.mobileReload('/')  // CC
              } else {
                $('.js-signin-msg').text("Yahoo log in failed " + response.ret)
                $('.js-signin-msg').show()
                trigger('loginFailed', response)
              }
            }
          }) */
        }
      }
    }
  })

  authWindow.addEventListener('exit', e => {
    console.log('Yahoo authWindow exit')
    if (!authGiven) {
      console.log('Yahoo permission not given or failed')
      // $('.js-signin-msg').text("Yahoo permission not given or failed")
      // $('.js-signin-msg').show()
    }
    tryingYahooLogin = false
  })
}


/*
export function appYahooLogin(callback) {
  const completeLoginCallback = callback
  try {
    if (navigator.connection.type === Connection.NONE) {
      console.log('No connection - please try again later.')
      completeLoginCallback({ status: 'No connection' })
      return
    }

    if (tryingYahooLogin) { return }
    ///////////////////////////////////////
    // Request user authenticates by opening passed URL
    // If user gives Ok, then pop-up window tries to open a page at ilovefreegle.
    // We catch and stop this open, get passed parameters and pass them as part of repeat FD login request

  } catch (e) {
    console.log('=========appYahooLogin exception', e)
    completeLoginCallback({ status: e.message })
  }
}
*/
