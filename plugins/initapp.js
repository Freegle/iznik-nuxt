import Vue from 'vue'

// Note: mobilePushId is the same regardless of which user is logged in

console.log('--------------initapp--------------')
const pushstate = Vue.observable({
  pushed: false,
  route: false
})
export const mobilestate = Vue.observable({ mobilePushId: false })

let isiOS = false
let acceptedMobilePushId = false
let mobilePush = false
let lastPushMsgid = false

window.iznikroot = location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1)
window.iznikroot = decodeURI(window.iznikroot.replace(/%25/g, '%2525'))
console.log('window.iznikroot ' + window.iznikroot)

const cordovaApp = {
  // Application Constructor
  initialize: function() {
    document.addEventListener(
      'deviceready',
      this.onDeviceReady.bind(this),
      false
    )
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are: 'pause', 'resume', etc.
  onDeviceReady: function() {
    console.log('cordovaApp: onDeviceReady')

    isiOS = window.device.platform === 'iOS'
    // if (!window.initialURL) {
    //   window.initialURL = window.location.href
    // }
    // $.ajaxSetup({
    //   mobileapp: 1
    // });

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

    //setTimeout(function() {
    console.log('push init start')
    if ((typeof window.PushNotification === 'undefined') || (!PushNotification)) {
      console.log('NO PUSH NOTIFICATION SERVICE')
      // alert("No PN");
    } else if (!mobilestate.mobilePushId) {
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
        mobilestate.mobilePushId = data.registrationId
        console.log('push registration ' + mobilestate.mobilePushId)
        // mobilePushId reported in to server in savePushId() by store/auth.js fetchUser
        // the watch code below also calls savePushId() in case we've already logged in
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
        // console.log(data)
        const foreground = data.additionalData.foreground.toString() === 'true' // Was first called in foreground or background
        let msgid = new Date().getTime()
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
        window.mobilePush.setApplicationIconBadgeNumber(function () { }, function () { }, data.count)

        /* May as well always re-get counts
        // Always try to set in-app counts
        if (('chatcount' in data.additionalData) && ('notifcount' in data.additionalData)) {
          var chatcount = parseInt(data.additionalData.chatcount);
          var notifcount = parseInt(data.additionalData.notifcount);
          console.log("Got chatcount " + chatcount + " notifcount " + notifcount);
          if (!isNaN(chatcount) && !isNaN(notifcount)) {
            Iznik.setHeaderCounts(chatcount, notifcount);
            Iznik.Session.chats.fetch();
          }
        } */

        // If in background or now in foreground having been woken from background
        if (('route' in data.additionalData) && !foreground && !doubleEvent && data.count) { // eg route: "/chats"
          console.log('Now in foreground: go to ', data.additionalData.route)
          pushstate.route = data.additionalData.route
          /* (function waitUntilLoggedIn(retry) {
            if (Iznik.Session.loggedIn) {
              setTimeout(function () {
                console.log("Push go to: " + data.additionalData.route);
                Router.navigate(data.additionalData.route, true);
              }, 500);
            } else {
              setTimeout(function () { if (--retry) { waitUntilLoggedIn(retry); } }, 1000);
            }
          })(10); */
        }

        if (foreground) { // Reload if route matches where we are - or if on any chat screen eg /chat/123456 or /chats
          console.log('Foreground: go to ', data.additionalData.route)
          pushstate.route = data.additionalData.route
          /* var frag = '/' + Backbone.history.getFragment();
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
          } */
        }

        console.log('PUSH mobilepushevent A')
        pushstate.pushed = true
        console.log('PUSH mobilepushevent B')

        // iOS needs to be told when we've finished: do it after a short delay to allow our code to run
        if (isiOS) {
          setTimeout(function() {
            mobilePush.finish(
              function() {
                console.log('iOS push finished OK')
              },
              function() {
                console.log('iOS push finished error')
              },
              data.additionalData.notId
            )
          }, 50)
        }
      })
    }
//    }, 15000)
  }
}

cordovaApp.initialize()

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


// Tell server our push notification id
// Cope if not logged in ie do it later
export async function savePushId(store) {
  if (acceptedMobilePushId !== mobilestate.mobilePushId) {
    const params = {
      notifications: {
        push: {
          type: isiOS ? 'FCMIOS' : 'FCMAndroid',
          subscription: mobilestate.mobilePushId
        }
      }
    }
    const data = await store.$api.session.save(params)
    if (data.ret === 0) {
      acceptedMobilePushId = mobilestate.mobilePushId
      console.log('savePushId: saved OK')
    } else { // 1 === Not logged in
      console.log('savePushId: Not logged in: OK will try again when signed in')
    }
  }
}

// Remember if we've logged out
// It could tell the server to invalidare pushid
// However we simply zap acceptedMobilePushId so it is sent when logged in
export function logoutPushId() {
  acceptedMobilePushId = false
  console.log('logoutPushId')
}

// When the plugin is loaded at runtime, a watches are setup...
// https://github.com/vuejs/rfcs/blob/function-apis/active-rfcs/0000-function-api.md#watchers
export default ({ store, router }) => {
  if (!router) console.log('--------------NO ROUTER :-(')
  // When mobilePushId changed, tell server our push notification id
  store.watch(
    () => mobilestate.mobilePushId,
    mobilePushId => {
      if (mobilePushId) {
        savePushId(store)
      }
    }
  )
  // When push received, refetch notification and chat counts
  store.watch(
    () => pushstate.pushed,
    pushed => {
      if (pushed) {
        console.log('--------------We have been pushed')
        store.dispatch('notifications/count')
        store.dispatch('chats/listChats')
        if (pushstate.route) {
          console.log('--------------route: ', pushstate.route)
          if (router) {
            router.push(location)
          } else {
            console.log('--------------NO ROUTER')
          }
        }

        pushstate.pushed = false
        pushstate.route = false
      }
    }
  )
}


console.log('--------------initedapp--------------')

