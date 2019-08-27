// Load Google SDK
import Vue from 'vue'

const VueGoogle = {}

window.gapiLoaded = false

VueGoogle.install = function install(Vue, options) {
  console.log('Install google')
  ;(function(d, s, id) {
    const fjs = d.getElementsByTagName(s)[0]
    if (d.getElementById(id)) {
      return
    }
    const js = d.createElement(s)
    js.id = id
    js.src = 'https://apis.google.com/js/platform.js'
    js.onload = e => {
      console.log('Loaded GAPI')
      setTimeout(() => {
        console.log('Timeout', window.gapi)
        if (window.gapi) {
          console.log('Init client')
          window.gapi.load('client', {
            callback: function() {
              console.log('Client loaded')
              window.gapi.client.init({
                apiKey: process.env.GOOGLE_API_KEY
              })
              window.gapiLoaded = true
              console.log('Client initialised')
            },
            onerror: function() {
              console.error('gapi.client failed to load!')
            },
            timeout: 30000,
            ontimeout: function() {
              console.error('GAPI client load timed out')
            }
          })

          window.gapi.load('auth2')
          try {
          } catch (e) {
            console.error('GAPI load failed', e)
          }
        }
      }, 10)
    }
    fjs.parentNode.insertBefore(js, fjs)
  })(document, 'script', 'google-jssdk')

  window.fbAsyncInit = function onSDKInit() {
    window.FB.init(options)
    window.FB.AppEvents.logPageView()
    Vue.FB = window.FB
    window.dispatchEvent(new Event('fb-sdk-ready'))
  }
  Vue.Google = undefined
}

Vue.use(VueGoogle)
