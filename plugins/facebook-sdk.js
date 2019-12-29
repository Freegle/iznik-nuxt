// Load Facebook SDK
import Vue from 'vue'

const VueFB = {}

VueFB.install = function install(Vue, options) {
  Vue.FB = undefined
  if (process.env.IS_APP) return // CC
  window.fbAsyncInit = function() {
    window.FB.init(options)
    window.FB.AppEvents.logPageView()
    Vue.FB = window.FB
    window.dispatchEvent(new Event('fb-sdk-ready'))
  }
  ;(function(d, s, id) {
    try {
      const fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) {
        return
      }

      const js = d.createElement(s)
      js.id = id
      js.src = '//connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    } catch (e) {
      console.error('Failed to load Facebook SDK', e)
    }
  })(document, 'script', 'facebook-jssdk')
}

Vue.use(VueFB, {
  appId: process.env.FACEBOOK_APPID,
  autoLogAppEvents: true,
  xfbml: true,
  version: 'v4.0'
})
