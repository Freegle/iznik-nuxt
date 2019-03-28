importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/3084f5579ee2f925ba92.js",
    "revision": "9435b627a1322bea3f8102c2008038af"
  },
  {
    "url": "/_nuxt/5e1660bce36d527898a1.js",
    "revision": "5124920ec36c586a62067386b8eb1aa2"
  },
  {
    "url": "/_nuxt/825631a31aa5a40a688a.js",
    "revision": "58f98edfa1fccc786c02d31616174d52"
  },
  {
    "url": "/_nuxt/bf0a1e89567bf7c9ab15.js",
    "revision": "99964b522ee5b2f0091b0e4589ac20ce"
  },
  {
    "url": "/_nuxt/c1ed3badfc240025bd8e.js",
    "revision": "61bdb3c22f97e2b076f786c87687f377"
  },
  {
    "url": "/_nuxt/dd4b4035cccf97fc4625.js",
    "revision": "f90a3e112a0ca9c65f5ae3f49e123898"
  },
  {
    "url": "/_nuxt/ef4c78f841f309d827a6.js",
    "revision": "d8b7227b93cf2c655ffe7bbc274d9b1f"
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
