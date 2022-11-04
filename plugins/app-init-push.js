import Vue from 'vue'
import { setTimeout } from 'core-js';

const querystring = require('querystring')

//export let apprequiredversion = false
//export let applatestversion = false

export const mobilestate = {
  isiOS: false,
  devicePersistentId: null
}

export const pushstate = Vue.observable({
  pushed: false, // Set to true to handle push in Vue context
  isiOS: false,
  route: false,
  modtools: false,
  mobilePushId: false, // Note: mobilePushId is the same regardless of which user is logged in
  inlineReply: false,
  chatid: false,
  apprequiredversion: false,
  applatestversion: false,
  checkForUpdate: false
})

const linkstate = Vue.observable({
  received: false, // Set to true to handle push in Vue context
  route: false
})

let acceptedMobilePushId = false
let mobilePush = false
let lastPushMsgid = false
let checkedForUpdate = false

window.iznikroot = location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1)
window.iznikroot = decodeURI(window.iznikroot.replace(/%25/g, '%2525'))
console.log('window.iznikroot ' + window.iznikroot)

const cordovaApp = {
  initialize: function () {
    console.log('--------------initapp--------------')
    document.addEventListener(
      'deviceready',
      this.onDeviceReady.bind(this),
      false
    )
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are: 'pause', 'resume', etc.
  onDeviceReady: function () {
    try {
      console.log('cordovaApp: onDeviceReady')

      this.getDevicePersistentId()
      /*
      // https://github.com/apache/cordova-android/issues/747
      if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
          console.log('Dark mode is supported');
      }
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      console.log('prefersDark', prefersDark);
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)');
      console.log('prefersLight', prefersLight);

      console.log('prefers-color-scheme', window.matchMedia('(prefers-color-scheme)').media);

      // Java: https://stackoverflow.com/questions/57449900/letting-webview-on-android-work-with-prefers-color-scheme-dark
      int nightModeFlags = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
      if (nightModeFlags == Configuration.UI_MODE_NIGHT_YES) {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
          webSettings.setForceDark(WebSettings.FORCE_DARK_ON);
        }
      }*/


      mobilestate.isiOS = window.device.platform === 'iOS'
      pushstate.isiOS = mobilestate.isiOS

      // Make window.open work in iOS app
      const prevwindowopener = window.open
      window.open = (url) => {
        console.log('App window.open', url)
        // eslint-disable-next-line no-undef
        cordova.InAppBrowser.open(url, '_system')
      }

      if (!mobilestate.isiOS) {
        // Enable pinch zoom on Android
        cordova.plugins.ZoomControl.ZoomControl('true') // enabling zoom control: setBuiltInZoomControls(true), setDefaultZoom(ZoomDensity.MEDIUM), setSupportZoom(true)
        cordova.plugins.ZoomControl.setBuiltInZoomControls('true') // Sets whether the WebView should use its built-in zoom mechanisms
        cordova.plugins.ZoomControl.setDisplayZoomControls('false') // Sets whether the WebView should display on-screen zoom controls when using the built-in zoom mechanisms.
        cordova.plugins.ZoomControl.setUseWideViewPort('false') // Sets whether the WebView should enable support for the "viewport" HTML meta tag or should use a wide viewport.
      }

      if (!process.env.IS_MTAPP) {
        window.IonicDeeplink.route({
          '/': {
            target: '',
            parent: ''
          }
        }, function (match) {
          console.log('========== Universal/App-link NOT HANDLED', match)
        }, function (nomatch) {
          //console.log('========== Universal/App-link', nomatch.$link.path)
          if (nomatch && nomatch.$link) {
            console.log('linkstate.route', nomatch.$link)
            linkstate.route = nomatch.$link
            linkstate.received = true
          }
        })
      }

      console.log('push init start')
      if ((typeof window.PushNotification === 'undefined') || (!PushNotification)) {
        console.log('NO PUSH NOTIFICATION SERVICE')
        // alert("No PN");
      } else if (!pushstate.mobilePushId) {
        if (!mobilestate.isiOS) {
          // On Android, give the default notification channel a name
          try {
            window.PushNotification.createChannel(
              () => {
                console.log('default channel success');
              },
              () => {
                console.log('default channel error');
              },
              {
                id: 'PushPluginChannel',
                description: process.env.IS_MTAPP ? 'Moderation tasks' : 'Chat messages',
                importance: 3,
                // sound: 'alert.mp3',
                vibration: false
              }
            )
          } catch (e) {
          }
        }


        mobilePush = window.PushNotification.init({
          android: {
            senderID: '423761283916', // FCM: https://console.firebase.google.com/project/scenic-oxygen-849/settings/general/android:org.ilovefreegle.direct
            sound: true,
            iconColor: process.env.IS_MTAPP ? '#003366' : '#5EcA24', // ModTools blue | Freegle green
            icon: 'icon'
            // forceShow: true,
          },
          ios: {
            alert: true,
            badge: true,
            sound: true
          }
        })
        if (!mobilePush) {
          console.log('MOBILE PUSH RETURNED FALSE')
          return
        }
        mobilePush.on('registration', function (data) {
          pushstate.mobilePushId = data.registrationId
          console.log('push registration ' + pushstate.mobilePushId)

          // mobilePushId reported in to server in savePushId() by store/auth.js fetchUser
          // The watch code below also calls savePushId() in case we've already logged in
        })

        mobilePush.on('notification', function (data) { // Normal notification
          handleNotification('notification', data)
        })
        mobilePush.on('replyToChat', function (data) { // Reply action: reply given or Reply button pressed
          handleNotification('replyToChat', data)
        })
      }

      /* window.plugins.webintent.getUri(function(url) {
        console.log('INTENT URL: ', url)
      })
      window.plugins.webintent.onNewIntent(function(url) {
        console.log('INTENT onNewIntent: ', url)
      }) */

      // Prompt a check for the latest app versions
      pushstate.checkForUpdate = true

    } catch (e) {
      console.log('onDeviceReady catch', e)
    }
  },

  getDevicePersistentId: async function () {
    console.log('window.device.uuid', window.device.uuid)

    if (window.device.platform !== 'iOS') {
      mobilestate.devicePersistentId = window.device.uuid
      console.log("getDevicePersistentId Android", mobilestate.devicePersistentId)
      return
    }

    function uuidv4() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    }

    try {
      console.log("getDevicePersistentId iOS")
      var guid = uuidv4();
      function setok() {
        console.log('SET OK:', guid)
        mobilestate.devicePersistentId = guid
      }
      function setfail(e) {
        console.log("SETFAIL:", e)
      }
      function gotok(val) {
        console.log('GOT: ', val)
        if (val == null) {
          Keychain.set(setok, setfail, "GUID", guid, false)
        } else {
          mobilestate.devicePersistentId = val
        }
      }
      function gotfail(e) {
        console.log("GOTFAIL:", e)
      }
      Keychain.get(gotok, gotfail, "GUID")
    } catch (e) {
      console.log("Exception", e.getMessage())
    }
  }
}

// Called to handle a push notification
// - normal notification
// - replyToChat reply given or Reply button pressed
//
// Note: before each notification, we send a first notification with count = 0 to clear notifications in Android
// Each notification will arrive twice if received in background/stopped: a doubleEvent
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
//
// Navigating in background works, so quit if doubleEvent

function handleNotification(notificationType, data) {
  console.log('push notification', notificationType)
  console.log(data)
  const foreground = data.additionalData.foreground.toString() === 'true' // Was first called in foreground or background
  // let msgid = new Date().getTime() // Can't tell if double event if notId not given
  let msgid = 0
  if ('notId' in data.additionalData) {
    msgid = data.additionalData.notId
  }
  const doubleEvent = !foreground && msgid !== 0 && msgid === lastPushMsgid
  lastPushMsgid = msgid
  if (!('count' in data)) {
    data.count = 0
  }
  if (!('modtools' in data.additionalData)) {
    data.additionalData.modtools = 0
  }
  const modtools = data.additionalData.modtools == '1'
  pushstate.modtools = modtools
  data.count = parseInt(data.count)
  console.log('foreground ' + foreground + ' double ' + doubleEvent + ' msgid: ' + msgid + ' count: ' + data.count + ' modtools: ' + modtools)
  if (data.count === 0) {
    mobilePush.clearAllNotifications() // no success and error fns given
    console.log('clearAllNotifications')
  }
  mobilePush.setApplicationIconBadgeNumber(function () { }, function () { }, data.count)

  if (!mobilestate.isiOS && 'inlineReply' in data.additionalData) {
    const inlineReply = data.additionalData.inlineReply.trim()
    console.log('======== inlineReply', inlineReply)
    if (inlineReply) {
      pushstate.inlineReply = inlineReply
      pushstate.chatid = parseInt(data.additionalData.chatids)
      // Trigger event handler
      pushstate.pushed = true
      // DON'T DO THIS return
    }
  }

  if (!doubleEvent) {
    // Pass route to go to (or update) but only if in background or just starting app
    // Note: if in foreground then rely on count updates to inform user
    if (!foreground && 'route' in data.additionalData) {
      pushstate.route = data.additionalData.route // eg /chat/123456 or /chats
    }

    // Trigger event handler
    pushstate.pushed = true
  }

  // iOS needs to be told when we've finished: do it after a short delay to allow our code to run
  if (mobilestate.isiOS) {
    setTimeout(function () {
      mobilePush.finish(
        function () {
          console.log('iOS push finished OK')
        },
        function () {
          console.log('iOS push finished error')
        },
        data.additionalData.notId
      )
    }, 50)
  }
}


// Tell server our push notification id
// Cope if not logged in ie do it later
export async function savePushId(store) {
  //console.log("savePushId NOW")
  if (acceptedMobilePushId !== pushstate.mobilePushId) {
    const params = {
      notifications: {
        push: {
          type: mobilestate.isiOS ? 'FCMIOS' : 'FCMAndroid',
          subscription: pushstate.mobilePushId
        }
      }
    }
    try {
      // Wait for the store if necessary.
      await store.restored
    } catch (e) {
      console.log('Store restore wait failed', e)
    }
    //console.log("savePushId RESTORED")
    const data = await store.$api.session.save(params)
    if (data.ret === 0) {
      acceptedMobilePushId = pushstate.mobilePushId
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

// Set home screen badge count
let lastBadgeCount = -1
export function setBadgeCount(badgeCount) {
  if( isNaN(badgeCount)) badgeCount = 0
  if (badgeCount !== lastBadgeCount) {
    if (process.env.IS_APP) {
      if (mobilePush) {
        mobilePush.setApplicationIconBadgeNumber(function () { }, function () { }, badgeCount)
        lastBadgeCount = badgeCount
      }
    }
  }
}

// When the plugin is loaded at runtime, watches are setup...
// https://github.com/vuejs/rfcs/blob/function-apis/active-rfcs/0000-function-api.md#watchers
export default ({ app, store, $api, $axios }) => { // route
  if (process.env.IS_APP) {

    // When isiOS changed, tell mobileapp
    store.watch(
      () => pushstate.isiOS,
      isiOS => {
        store.commit('mobileapp/setisiOS', isiOS)
      }
    )

    // When mobilePushId changed...
    store.watch(
      () => pushstate.mobilePushId,
      mobilePushId => {
        // tell server our push notification id
        if (mobilePushId) {
          setTimeout(() => {
            savePushId(store)
          }, 1000)
        }
        // and remember whether pushAccepted
        store.commit('mobileapp/setpushAccepted', mobilePushId)
      }
    )
    // When push received, refetch notification and chat counts, and go to route if given
    store.watch(
      () => pushstate.pushed,
      pushed => {
        if (pushed) {
          if (pushstate.inlineReply) {
            console.log('WATCH inlineReply', pushstate.chatid, pushstate.inlineReply)
            const params = {
              roomid: pushstate.chatid,
              message: pushstate.inlineReply
            }
            store.$api.chat.send(params)
            pushstate.inlineReply = false
            pushstate.pushed = false
            pushstate.route = false
            return
          }

          store.dispatch('notifications/count')
          store.dispatch('chats/listChats')
          if (pushstate.modtools) {
            store.dispatch('auth/fetchUser', {
              components: ['work'],
              force: true
            })
          }

          if (pushstate.route) {
            pushstate.route = pushstate.route.replace('/chat/', '/chats/') // Match redirects in nuxt.config.js
            if (app.router.currentRoute.path !== pushstate.route) {
              console.log('GO TO ', pushstate.route)
              app.router.push({ path: pushstate.route })  // Often doesn't work as intended when starting app from scratch as this routing is too early. Delaying doesn't seem to help.
            }
          }

          pushstate.pushed = false
          pushstate.route = false
        }
      }
    )
    // When linkstate.received, move to given route
    store.watch(
      () => linkstate.received,
      async received => {
        if (received) {
          linkstate.received = false
          let route = linkstate.route.path
          if (route === '') route = '/'
          if (route === '/settings') {
            try {
              // https://www.ilovefreegle.org/settings?u=12345&k=uniquekey&src=forgotpass
              console.log('queryString', linkstate.route.queryString)
              const query = querystring.parse(linkstate.route.queryString)
              if (query.src === 'forgotpass' && query.u && query.k) {
                console.log('FORGOTPASS LOGIN')
                // Clear the related list.  This avoids accidentally flagging members as related if people forget to close
                // an incognito tab while impersonating.
                await store.dispatch('auth/clearRelated')

                // Log in using the username and key.
                await store.dispatch('auth/login', {
                  u: query.u,
                  k: query.k,
                  force: true
                })
                console.log('FORGOTPASS SUCCESS')
                if (app.router.currentRoute.path !== route) {
                  app.router.push({ path: route })
                }
              }
            } catch (e) {
              // Login failed.  Usually this is because they're logged in as someone else. Ignore it.
              console.log('Login failed', e)
            }
            return
          }
          if (app.router.currentRoute.path !== route) {
            console.log('GO TO ', route)
            app.router.push({ path: route })
            let checker = 0
            const intervalId = setInterval(function () {
              if (app.router.currentRoute.path !== route) {
                console.log('RE GO TO ', route)
                clearInterval(intervalId)
                app.router.push({ path: route })
              }
              if( ++checker===10) clearInterval(intervalId)
            }, 2000)

          }
          if (linkstate.route.queryString) { // copied from middleware/src.js
            console.log('=============== linkstate.route.queryString', linkstate.route.queryString)
            const query = new Proxy(new URLSearchParams(linkstate.route.queryString), {
              get: (searchParams, prop) => searchParams.get(prop),
            });
            if (query.src) {
              console.log('=============== query.src', query.src)
              $axios.post(process.env.API + '/src', {
                src: query.src
              })
                .catch(e => {
                  console.error('SRC log failed', e)
                })
            }
          }

        }
      }
    )

    // When pushstate.checkForUpdate set, check for app update
    store.watch(
      () => pushstate.checkForUpdate,
      async checkForUpdate => {
        if (checkForUpdate && !checkedForUpdate) {
          checkedForUpdate = true
          await checkForAppUpdate($api, $axios, store, app.router)
        }
      }
    )
  }
}

/*
 * Get required and latest app versions fromn the server
  app_fd_version_ios_required
  app_fd_version_ios_latest
	app_mt_version_ios_required
	app_mt_version_ios_latest
	app_fd_version_android_required
	app_fd_version_android_latest
	app_mt_version_android_required
	app_mt_version_android_latest
 */
async function checkForAppUpdate($api, $axios, store, router) {
  try {
    if (process.env.IS_APP || process.env.IS_MTAPP) {
      //console.log('checkForAppUpdate isIOS', mobilestate.isiOS)
      const requiredKey = process.env.IS_MTAPP ? (mobilestate.isiOS ? 'app_mt_version_ios_required' : 'app_mt_version_android_required') :
        (mobilestate.isiOS ? 'app_fd_version_ios_required' : 'app_fd_version_android_required')
      const latestKey = process.env.IS_MTAPP ? (mobilestate.isiOS ? 'app_mt_version_ios_latest' : 'app_mt_version_android_latest') :
        (mobilestate.isiOS ? 'app_fd_version_ios_latest' : 'app_fd_version_android_latest')

      const required = await $api.config.fetch({ key: requiredKey })
      //console.log(required)
      //console.log(required.values)
      if (required && required.values && required.values.length === 1) {
        const requiredVersion = required.values[0].value
        console.log(requiredVersion)
        if (requiredVersion) {
          console.log("SET pushstate.apprequiredversion", requiredVersion)
          pushstate.apprequiredversion = requiredVersion
          if (versionOutOfDate(requiredVersion)) {
            console.log('appupdate required!')
            router.push({ path: '/appupdate' })
          }
        }
      }

      const latest = await $api.config.fetch({ key: latestKey })
      //console.log(latest)
      //console.log(latest.values)
      if (latest && latest.values && latest.values.length === 1) {
        const latestVersion = latest.values[0].value
        console.log(latestVersion)
        if (latestVersion) {
          console.log("SET pushstate.applatestversion", latestVersion)
          pushstate.applatestversion = latestVersion
        }
      }
    }
  } catch (e) {
    console.log('checkForAppUpdate ERROR', e)
  }
}

export function versionOutOfDate(newver) {
  const currentver = process.env.IS_MTAPP ? process.env.MODTOOLS_VERSION : process.env.MOBILE_VERSION
  // console.log('versionOutOfDate now:' + currentver + ' vs ' + newver)
  if (!newver) return false
  const anewver = newver.split('.')
  const acurrentver = currentver.split('.')
  for (let vno = 0; vno < 3; vno++) {
    const cv = parseInt(acurrentver[vno])
    const nv = parseInt(anewver[vno])
    if (nv > cv) return true
  }
  return false
}

if (process.env.IS_APP) {
  cordovaApp.initialize()
  console.log('--------------initedapp--------------')
}
