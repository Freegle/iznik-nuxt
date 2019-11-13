// Load Facebook SDK
// TODO Check if blocked.
import Vue from 'vue'

const VueFB = {}

VueFB.install = function install(Vue, options) {
  console.log('Load Facebook sdk')
  Vue.FB = undefined
  ;(function(d, s, id) {
    try {
      console.log('Install with', d, s, id)
      const fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) {
        console.log('Already there')
        return
      }

      console.log('Not there, add it')
      const js = d.createElement(s)
      js.id = id
      js.src = '//connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    } catch (e) {
      console.error('Failed to load Facebook SDK', e)
    }
  })(document, 'script', 'facebook-jssdk')

  window.fbAsyncInit = function onSDKInit() {
    console.log('Loaded FB')
    window.FB.init(options)
    window.FB.AppEvents.logPageView()
    Vue.FB = window.FB
    window.dispatchEvent(new Event('fb-sdk-ready'))
  }
}

Vue.use(VueFB, {
  appId: process.env.FACEBOOK_APPID,
  autoLogAppEvents: true,
  xfbml: true,
  version: 'v4.0'
})
