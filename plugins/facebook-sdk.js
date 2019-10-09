// Load Facebook SDK
// TODO Check if blocked.
import Vue from 'vue'

const VueFB = {}

VueFB.install = function install(Vue, options) {
  ;(function(d, s, id) {
    const fjs = d.getElementsByTagName(s)[0]
    if (d.getElementById(id)) {
      return
    }
    const js = d.createElement(s)
    js.id = id
    js.src = 'https://connect.facebook.net/en_US/sdk.js'  // CC
    fjs.parentNode.insertBefore(js, fjs)
  })(document, 'script', 'facebook-jssdk')

  window.fbAsyncInit = function onSDKInit() {
    window.FB.init(options)
    window.FB.AppEvents.logPageView()
    Vue.FB = window.FB
    window.dispatchEvent(new Event('fb-sdk-ready'))
  }
  Vue.FB = undefined
}

Vue.use(VueFB, {
  appId: process.env.FACEBOOK_APPID,
  autoLogAppEvents: true,
  xfbml: true,
  version: 'v4.0'
})
