// Do mobile app Yahoo login using auth popup handled within app using cordova-plugin-inappbrowser

function extractQueryStringParams(url) {
  let urlParams = false
  const qm = url.indexOf('?')
  if (qm >= 0) {
    const qs = url.substring(qm + 1)
    // http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    const pl = /\+/g  // Regex for replacing addition symbol with a space
    const search = /([^&=]+)=?([^&]*)/g
    const decode = s => { return decodeURIComponent(s.replace(pl, ' ')) }
    urlParams = {}
    let match
    while ((match = search.exec(qs))) {
      urlParams[decode(match[1]).replace(/\./g, "_")] = decode(match[2]) // Convert period to underscore to get through to openid.php
    }
  }
  return urlParams
}

export function appYahooLogin(returnPath, callback) {
  const completeLoginCallback = callback
  console.log('appYahooLogin start', returnPath)

  if (navigator.connection.type === Connection.NONE) {
    console.log('No connection - please try again later.')
    completeLoginCallback({ error: 'No connection' })
    return
  }

  let authGiven = false
  const here = 'https://www.ilovefreegle.org'

  const yauthurl =
    'https://api.login.yahoo.com/oauth2/request_auth?client_id=' +
    process.env.YAHOO_CLIENTID +
    '&redirect_uri=' +
    encodeURIComponent(here + '/yahoologin?returnto=' + returnPath) +
    '&response_type=code&language=en-us&scope=sdpp-w'

  const authWindow = cordova.InAppBrowser.open(yauthurl, '_blank', 'location=yes,menubar=yes')
  authWindow.addEventListener('loadstart', e => {
    console.log('yloadstart: ', e)

    if (e && e.url) {
      // Catch redirect after auth back to ilovefreegle
      if (
        e.url.indexOf('https://www.ilovefreegle.org/') === 0 ||
        e.url.indexOf('https://iznik.ilovefreegle.org/') === 0 ||
        e.url.indexOf('https://fdnuxt.ilovefreegle.org/') === 0 ||
        e.url.indexOf('https://fdapidbg.ilovefreegle.org/') === 0
      ) {
        authWindow.close()
        const urlParams = extractQueryStringParams(e.url)
        if (urlParams) {
          authGiven = true

          // Try logging in again at FD
          completeLoginCallback(urlParams)
        }
      }
    }
  })

  authWindow.addEventListener('exit', e => {
    console.log('Yahoo authWindow exit')
    if (!authGiven) {
      console.log('Yahoo permission not given or failed')
      completeLoginCallback({ error: 'Yahoo permission not given or failed' })
    }
  })
}
