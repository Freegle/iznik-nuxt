importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/app.js",
    "revision": "55251f3bc1dfe96786b236a9388f4949"
  },
  {
    "url": "/_nuxt/commons.app.js",
    "revision": "a736b131d5f208034682f2cb089350c0"
  },
  {
    "url": "/_nuxt/pages_chats__id.js",
    "revision": "6ed0388bf64e39a1e4052803b402190e"
  },
  {
    "url": "/_nuxt/pages_chitchat__id.js",
    "revision": "af7b5483804e15f59047fce4787c8729"
  },
  {
    "url": "/_nuxt/pages_explore__id.js",
    "revision": "4267f8f9b95ab29e009cc16db1bf04f4"
  },
  {
    "url": "/_nuxt/pages_find_index.js",
    "revision": "093dbd345d9c8f99e9ffc89f3056f47e"
  },
  {
    "url": "/_nuxt/pages_find_search__term.js",
    "revision": "044dd368b6e01c3bf5257651907a5eb9"
  },
  {
    "url": "/_nuxt/pages_give_index.js",
    "revision": "386ee5640c66c0d6dc56a486e0340425"
  },
  {
    "url": "/_nuxt/pages_give_whatisit.js",
    "revision": "e33f5f5b4f0426126d2c8b6ebfcd6adf"
  },
  {
    "url": "/_nuxt/pages_give_whatnext.js",
    "revision": "a0e1de0562587953489dce8d3daeecd4"
  },
  {
    "url": "/_nuxt/pages_give_whoami.js",
    "revision": "82665d2cf33e44cbfea814f8aa28e611"
  },
  {
    "url": "/_nuxt/pages_index.js",
    "revision": "5835d36477df71dd5553405f6ea26b2a"
  },
  {
    "url": "/_nuxt/pages_login.js",
    "revision": "f9a9daf50d5a359bb6d31e9c0517ea76"
  },
  {
    "url": "/_nuxt/pages_mygroups.js",
    "revision": "505ce561bb11eea372c0d8ffb5955751"
  },
  {
    "url": "/_nuxt/runtime.js",
    "revision": "f696dd6160079635f3c8498bbe12c49a"
  },
  {
    "url": "/_nuxt/vendors.pages_chats__id.pages_chitchat__id.pages_give_whatisit.js",
    "revision": "e10b747327bbe908196338209eacaa1f"
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
