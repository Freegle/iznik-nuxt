importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/app.js",
    "revision": "da6bd2fd554c062d9467197a6c6f31b0"
  },
  {
    "url": "/_nuxt/commons.app.js",
    "revision": "899b0642ff73f928ef88545e57f377f0"
  },
  {
    "url": "/_nuxt/pages_chats__id.js",
    "revision": "0b6ff629715b61c00152e04da5fb33b7"
  },
  {
    "url": "/_nuxt/pages_chitchat__id.js",
    "revision": "34fad672cbdc03ead37429781e9fac51"
  },
  {
    "url": "/_nuxt/pages_explore__id.js",
    "revision": "9425c8a36e87ba326a8cf3fcc95d0979"
  },
  {
    "url": "/_nuxt/pages_find_index.js",
    "revision": "fd9ec0906be565c7df58daf1ed29a94e"
  },
  {
    "url": "/_nuxt/pages_find_search__term.js",
    "revision": "cddddd05577fcd5d357db4846a4116a1"
  },
  {
    "url": "/_nuxt/pages_give_index.js",
    "revision": "6b4faf8824681a98b14c2e2c5e613019"
  },
  {
    "url": "/_nuxt/pages_give_whatisit.js",
    "revision": "e0f03ef14bd20121c17bc7195ee396cd"
  },
  {
    "url": "/_nuxt/pages_give_whatnext.js",
    "revision": "b82aa39daa7029b2009f8c4ec1681e97"
  },
  {
    "url": "/_nuxt/pages_give_whoami.js",
    "revision": "d03328929a50e391a6e2817e51ca1ff7"
  },
  {
    "url": "/_nuxt/pages_index.js",
    "revision": "4e8f038c8b1e49576199abebd2790ec8"
  },
  {
    "url": "/_nuxt/pages_login.js",
    "revision": "3bde04444ab89275596b730e184e2e88"
  },
  {
    "url": "/_nuxt/pages_mygroups.js",
    "revision": "fceeaad5948aa71ce7e40935a70e53e4"
  },
  {
    "url": "/_nuxt/runtime.js",
    "revision": "f696dd6160079635f3c8498bbe12c49a"
  },
  {
    "url": "/_nuxt/vendors.pages_chats__id.pages_chitchat__id.pages_give_whatisit.js",
    "revision": "c0cf4930970c4007334f9f62c669c600"
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
