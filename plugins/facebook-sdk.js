// Load Facebook SDK
import Vue from 'vue'

const VueFB = {}

VueFB.install = function install(Vue, options) {
  Vue.FB = undefined

  window.fbAsyncInit = function() {
    window.FB.init(options)
    window.FB.AppEvents.logPageView()
    Vue.FB = window.FB

    // We need to have some special code for IE11 - see https://stackoverflow.com/questions/27176983/dispatchevent-not-working-in-ie11.
    let event

    if (typeof Event === 'function') {
      event = new Event('fb-sdk-ready')
    } else {
      event = document.createEvent('Event')
      event.initEvent('fb-sdk-ready', true, true)
    }
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
