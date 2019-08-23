importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/app.01e7b97c.js",
    "revision": "e8c6c05ab8e1730eec278c91d6267a89"
  },
  {
    "url": "/_nuxt/app.f69643ec.js",
    "revision": "4987b6439a39e17701453e1fc6b76163"
  },
  {
    "url": "/_nuxt/commons.app.2a42e354.js",
    "revision": "8ebe62818f32f72861c8f9281b1d705d"
  },
  {
    "url": "/_nuxt/commons.app.aaac3122.js",
    "revision": "a6b47bfc6903bf037fa76031103840ba"
  },
  {
    "url": "/_nuxt/commons.app.fdc6512a.js",
    "revision": "c7c1237f9cdbe4b2ea2a9bfd20856b4c"
  },
  {
    "url": "/_nuxt/pages_chats__id.01e7b97c.js",
    "revision": "455ce7fd9ef86a51a732bbbd87ba066a"
  },
  {
    "url": "/_nuxt/pages_chitchat__id.f075b844.js",
    "revision": "2c1f71244eaf222d31a6a0372d0c2d29"
  },
  {
    "url": "/_nuxt/pages_explore__id.f075b844.js",
    "revision": "6a3b38412174d8ac0e5116a71ae2d2b9"
  },
  {
    "url": "/_nuxt/pages_find_index.f075b844.js",
    "revision": "46e5d39ba49a3ed2f487a14ebff2bf1e"
  },
  {
    "url": "/_nuxt/pages_find_search__term.f075b844.js",
    "revision": "46a8627e6025ae04c944d89a3e3fda3d"
  },
  {
    "url": "/_nuxt/pages_give_index.f075b844.js",
    "revision": "38836f91492770a45478d0865d21eab6"
  },
  {
    "url": "/_nuxt/pages_give_whatisit.f075b844.js",
    "revision": "4f21ef1efda2d4d2b826cac806ecb29e"
  },
  {
    "url": "/_nuxt/pages_give_whatnext.f075b844.js",
    "revision": "c6dba9c42237de3b96f775a305ae05ab"
  },
  {
    "url": "/_nuxt/pages_give_whoami.7563cc1f.js",
    "revision": "2580f94cc30e2e2f9488f246c535b3e8"
  },
  {
    "url": "/_nuxt/pages_index.4fb3e540.js",
    "revision": "e5ca312de82eddf5624d141d1c4c3420"
  },
  {
    "url": "/_nuxt/pages_login.1e328e8f.js",
    "revision": "ba505c01fd708d2399e56414a54cd4de"
  },
  {
    "url": "/_nuxt/pages_mygroups.f075b844.js",
    "revision": "4f0107e7d186856ceac0fda875f963a2"
  },
  {
    "url": "/_nuxt/runtime.js",
    "revision": "9a995621ca73939c113c24dc18fb1e4b"
  },
  {
    "url": "/_nuxt/vendors.app.0e39a4e6.js",
    "revision": "92ec20b0aaf87bd953bb4ca337143888"
  },
  {
    "url": "/_nuxt/vendors.app.205977d4.js",
    "revision": "1e40e4ef70c1d6cc7ee7c587336629da"
  },
  {
    "url": "/_nuxt/vendors.app.253ae210.js",
    "revision": "b98dfd8279c0bdb7025b5dfa0f03fc14"
  },
  {
    "url": "/_nuxt/vendors.app.46bc49e7.js",
    "revision": "7996286816f1104345c55d7d502e325e"
  },
  {
    "url": "/_nuxt/vendors.app.7274e1de.js",
    "revision": "4e130a634996ece7c59dfda4c64bf36f"
  },
  {
    "url": "/_nuxt/vendors.app.a6c8e184.js",
    "revision": "ceb03e8c472856bb5010d9d8f93b8867"
  },
  {
    "url": "/_nuxt/vendors.app.b3938def.js",
    "revision": "084b89104e1c8bae9b9299ced0b7da02"
  },
  {
    "url": "/_nuxt/vendors.app.b5906859.js",
    "revision": "6777d51401493bddc1c7eb2148ae7a90"
  },
  {
    "url": "/_nuxt/vendors.app.b9cf3951.js",
    "revision": "3967bcdc3c5a8d2931cc319fb9997847"
  },
  {
    "url": "/_nuxt/vendors.app.be71a85b.js",
    "revision": "8f1bdb20e351621a8280406722e92fc3"
  },
  {
    "url": "/_nuxt/vendors.app.cc291d78.js",
    "revision": "ce86d6f24d840ca303f84c6944b74b00"
  },
  {
    "url": "/_nuxt/vendors.app.f90d14fc.js",
    "revision": "ab14a4f95d64c42366a10a5e6afce484"
  },
  {
    "url": "/_nuxt/vendors.pages_chats__id.pages_chitchat__id.pages_give_whatisit.203e0718.js",
    "revision": "4b3a30127b95190054bf8480eecaa23a"
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
