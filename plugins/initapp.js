import Vue from 'vue'

// app initialisation based on standard Cordova code
console.log('--------------initapp--------------')

const pushstate = Vue.observable({ pushed: false })

export const mobilestate = Vue.observable({
  isiOS: false,
  mobilePushId: false
})

let mobilePush = false
let mobilePushId = false
let lastPushMsgid = false

window.iznikroot = location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1)
window.iznikroot = decodeURI(window.iznikroot.replace(/%25/g, '%2525'))
console.log('window.iznikroot ' + window.iznikroot)

const app = {
  // Application Constructor
  initialize: function() {
    console.log('--------------initapp--------------')
    document.addEventListener(
      'deviceready',
      this.onDeviceReady.bind(this),
      false
    )
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function() {
    console.log('app: onDeviceReady')

    mobilestate.isiOS = window.device.platform === 'iOS'
    // if (!window.initialURL) {
    //   window.initialURL = window.location.href
    // }
    // $.ajaxSetup({
    //   mobileapp: 1
    // });

    // Catch back button and clear chats
    window.addEventListener('popstate', function(e) {
      try {
        console.log('----------popstate----------')
        // var ChatHolder = new Iznik.Views.Chat.Holder()
        // ChatHolder.minimiseall()
      } catch (e) {}
    })

    // document.addEventListener("offline", function () { window.isOnline = false; console.log("offline"); window.showNetworkStatus() }, false);
    // document.addEventListener("online", function () { window.isOnline = true; console.log("online"); window.showNetworkStatus() }, false);
    document.addEventListener(
      'offline',
      function() {
        console.log('== EVENT offline')
      },
      false
    )
    document.addEventListener(
      'online',
      function() {
        console.log('== EVENT online')
      },
      false
    )

    // We have a busy indicator
    /* $(document).ajaxStop(function() {
      $('#spinner').hide();
      // We might have added a class to indicate that we were waiting for an AJAX call to complete.
      $('.showclicked').removeClass('showclicked');
      window.hideHeaderWait();
    });

    $(document).ajaxStart(function () {
      $('#spinner').show();
      window.showHeaderWait();
      if ((navigator.connection.type != Connection.NONE) && !window.isOnline) { // Remove red cloud if we are now actually online
        console.log("ajaxStart fire online");
        var event = new Event('online');
        document.dispatchEvent(event);
      }
    }); */

    setTimeout(function() {
    console.log('push init start')
    if ((typeof window.PushNotification === 'undefined') || (!PushNotification)) {
      console.log('NO PUSH NOTIFICATION SERVICE')
      // alert("No PN");
    } else if (!mobilePushId) {
      mobilePush = window.PushNotification.init({
        android: {
          senderID: '423761283916', // FCM: https://console.firebase.google.com/project/scenic-oxygen-849/settings/general/android:org.ilovefreegle.direct
          // senderID: "845879623324", // Old GCM way
          sound: false,
          iconColor: '#5EcA24', // Freegle green
          icon: 'icon'
          // forceShow: true,
        },
        ios: {
          // senderID: "845879623324",
          alert: true,
          badge: true,
          sound: false
        }
      })
      mobilestate.mobilePush = mobilePush
      mobilePush.on('registration', function (data) {
        mobilePushId = data.registrationId
        mobilestate.mobilePushId = mobilePushId
        console.log('push registration ' + mobilePushId)
        // mobilePushId reported to server in store/auth.js fetchUser
        // alert("registration: " + mobilePushId);
      })
      // Called to handle a push notification
      //
      // A push shows a notification immediately and sets desktop badge count (on iOS and some Android)
      // Note: badge count also set elsewhere when unseen chats counted (and may disagree!)
      //
      // Android:
      //  In foregound:   foreground: true:   doubleEvent: false
      //  In background:  foreground: false:  doubleEvent: false
      //           then:  foreground: false:  doubleEvent: true
      //  Not running:    as per background
      //
      // iOS:
      //  In foregound:   foreground: true:   doubleEvent: false
      //  In background:  foreground: false:  doubleEvent: false
      //           then:  foreground: false:  doubleEvent: true
      //  Not running:    as per background?

      mobilePush.on('notification', function(data) {
        console.log('push notification')
        console.log(data)
        const foreground = data.additionalData.foreground.toString() === 'true' // Was first called in foreground or background
        let msgid = (new Date()).getTime()
        if ('notId' in data.additionalData) {
          msgid = data.additionalData.notId
        }
        const doubleEvent = msgid === lastPushMsgid
        lastPushMsgid = msgid
        if (!('count' in data)) {
          data.count = 0
        }
        data.count = parseInt(data.count)
        console.log('foreground ' + foreground + ' double ' + doubleEvent + ' msgid: ' + msgid + ' count: ' + data.count)
        if (data.count === 0) {
          mobilePush.clearAllNotifications() // no success and error fns given
          console.log('clearAllNotifications')
        }
        // window.mobilePush.setApplicationIconBadgeNumber(function () { }, function () { }, data.count);
        console.log('push set badge: ', data.count, typeof data.count)
        mobilePush.setApplicationIconBadgeNumber(
          function() { console.log('badge success') },
          function() { console.log('badge error') },
          data.count)

        console.log('PUSH mobilepushevent A')
        // window.dispatchEvent(mobilepushevent)
        //document.dispatchEvent(new Event('mobilepush'))
        pushstate.pushed = true
        console.log('PUSH mobilepushevent B')
        /* console.log('PUSH dispatch store')
        store.dispatch('notifications/count')
        store.dispatch('chats/listChats')
        console.log('PUSH dispatched store') */

        /* // Always try to set in-app counts
        if (('chatcount' in data.additionalData) && ('notifcount' in data.additionalData)) {
          var chatcount = parseInt(data.additionalData.chatcount);
          var notifcount = parseInt(data.additionalData.notifcount);
          console.log("Got chatcount " + chatcount + " notifcount " + notifcount);
          if (!isNaN(chatcount) && !isNaN(notifcount)) {
            Iznik.setHeaderCounts(chatcount, notifcount);
            Iznik.Session.chats.fetch();
          }
        }

        // If in background or now in foreground having been woken from background
        if (('route' in data.additionalData) && !foreground && !doubleEvent && data.count) {
          (function waitUntilLoggedIn(retry) {
            if (Iznik.Session.loggedIn) {
              setTimeout(function () {
                console.log("Push go to: " + data.additionalData.route);
                Router.navigate(data.additionalData.route, true);
              }, 500);
            } else {
              setTimeout(function () { if (--retry) { waitUntilLoggedIn(retry); } }, 1000);
            }
          })(10);
        }

        if (foreground) { // Reload if route matches where we are - or if on any chat screen eg /chat/123456 or /chats
          var frag = '/' + Backbone.history.getFragment();
          if (data.additionalData.route) {
            if (frag == data.additionalData.route) {
              console.log("fg: Reload as route matches");
              Backbone.history.loadUrl();
            }
            else {
              if ((frag.substring(0, 5) == '/chat') && (data.additionalData.route.substring(0, 5) == '/chat')) {
                console.log("fg: Reload as route is on chat");
                Backbone.history.loadUrl(); // refresh rather than go to route
              }
            }
          }
        } */
        if (mobilestate.isiOS) {
          mobilePush.finish(
            function() {
              console.log('push finished OK')
              // alert("finished");
            },
            function() {
              console.log('push finished error')
              // alert("finished");
            },
            data.additionalData.notId
          )
        }
      })
    }
    }, 15000)
  }
}

app.initialize()

/* // Fix up CSS cases with absolute url path
var style = document.createElement('style')
style.type = 'text/css'
var css = '.bodyback { background-image: url("' + iznikroot + 'images/wallpaper.png") !important; } \r'
css += '.dd .ddTitle{color:#000;background:#e2e2e4 url("' + iznikroot + 'images/msdropdown/skin1/title-bg.gif") repeat-x left top !important; } \r'
css += '.dd .ddArrow{width:16px;height:16px; margin-top:-8px; background:url("' + iznikroot + 'images/msdropdown/skin1/dd_arrow.gif") no-repeat !important;} \r'
css += '.splitter { background: url("' + iznikroot + 'images/vsizegrip.png") center center no-repeat !important; } \r'
style.innerHTML = css
//console.log(css)
document.getElementsByTagName('head')[0].appendChild(style) */


/*Vue.use({
  install(Vue) {
    console.log('--------------initapp install--------------')
    Vue.prototype.$storeMobile = function(store) { // Do not use arrow as it breaks 'this': () => {       // this.$nuxt.$store
      console.log('--------------$storeMobile--------------')
      store.mobileapp = {
        isiOS: isiOS,
        mobilePushId: mobilePushId
      }
      console.log('--------------$storeMobile done --------------')
    }
  }
})*/

export default ({ store }) => {
  store.watch(
    () => pushstate.pushed,
    pushed => {
      console.log('--------------pushed changed')
      if (pushed) {
        console.log('--------------We have been pushed')
        // We have been pushed.  Refetch our notification count and chat count
        store.dispatch('notifications/count')
        store.dispatch('chats/listChats')
        pushstate.pushed = false
      }
    }
  )
}

/* document.addEventListener('mobilepush', function (ev) {
  console.log('initapp mobilepush', ev)
  state.pushed = true
  console.log('initapp mobilepush done')
}, false) */



console.log('--------------initedapp--------------')

