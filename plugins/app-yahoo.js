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

export function appYahooLogin(yauthurl, callback) {
  const completeLoginCallback = callback
  console.log('appYahooLogin: ' + yauthurl)

  if (navigator.connection.type === Connection.NONE) {
    console.log('No connection - please try again later.')
    completeLoginCallback({ status: 'No connection' })
    return
  }

  let authGiven = false

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
          urlParams.yahoologin = true

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
      completeLoginCallback({ status: 'Yahoo permission not given or failed' })
    }
  })
}
