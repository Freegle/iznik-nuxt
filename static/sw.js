importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/app.js",
    "revision": "5097a2193e08bd4ad0995878218929fb"
  },
  {
    "url": "/_nuxt/commons.app.js",
    "revision": "aa134274a35025ca2af3eba5ea7267fa"
  },
  {
    "url": "/_nuxt/pages_chats__id.js",
    "revision": "c69d800ba84240ee8a7bbbb6c94c157f"
  },
  {
    "url": "/_nuxt/pages_chitchat__id.js",
    "revision": "081b51805f70a354670e55fc8f814d24"
  },
  {
    "url": "/_nuxt/pages_explore__id.js",
    "revision": "5218eabf34a3847b0a8694dfe57c74d2"
  },
  {
    "url": "/_nuxt/pages_find_index.js",
    "revision": "88a73359f77134f257eda48c7aad485b"
  },
  {
    "url": "/_nuxt/pages_find_search__term.js",
    "revision": "b29156e0f865467bfc280fd71ec9dba0"
  },
  {
    "url": "/_nuxt/pages_give_index.js",
    "revision": "a6162ff9addfe0644bfa89e795d2a031"
  },
  {
    "url": "/_nuxt/pages_give_whatisit.js",
    "revision": "913ed62cd58fb862c0281a1e4b18f8d4"
  },
  {
    "url": "/_nuxt/pages_give_whatnext.js",
    "revision": "5c574e62bbd8d22fc4b52d6be305a6ab"
  },
  {
    "url": "/_nuxt/pages_give_whoami.js",
    "revision": "07b41437a8a85f8353ee5eb4edcbb319"
  },
  {
    "url": "/_nuxt/pages_index.js",
    "revision": "054889a514c33e93144efd390dbbc694"
  },
  {
    "url": "/_nuxt/pages_login.js",
    "revision": "e87ad5230821ad7957908959621a604a"
  },
  {
    "url": "/_nuxt/pages_mygroups.js",
    "revision": "0f8ff25bf60c1cf6aa305f10b36e381d"
  },
  {
    "url": "/_nuxt/runtime.js",
    "revision": "f696dd6160079635f3c8498bbe12c49a"
  },
  {
    "url": "/_nuxt/vendors.pages_chats__id.pages_chitchat__id.pages_give_whatisit.js",
    "revision": "1a467a4e688a56262093eb1529d72091"
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
