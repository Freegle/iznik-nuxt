importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/12771f5882652e77a01b.js",
    "revision": "ad1d287643f99a06b9d3daf34788d52e"
  },
  {
    "url": "/_nuxt/16f576d44667382fea73.js",
    "revision": "4c3d43e8ad886afeb7ec5c1e70357345"
  },
  {
    "url": "/_nuxt/7e9d2f01271e931e8668.js",
    "revision": "c45567462e1f1402dd0aac4f5fb092cc"
  },
  {
    "url": "/_nuxt/c6f3e62c86a43e56e66b.js",
    "revision": "104ac50c2c3673b90a85ce07cab32f07"
  },
  {
    "url": "/_nuxt/cf0d7dbf0b6ffc7ea796.js",
    "revision": "b42c6087c0be06b1c7a03b275b9cec89"
  },
  {
    "url": "/_nuxt/edc1530ccf0801cf26b8.js",
    "revision": "4ae001e65a8b3fcdcab13fb961eb79aa"
  }
], {
  "cacheId": "iznik-nuxt",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
