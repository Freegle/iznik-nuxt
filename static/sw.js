importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/1748ff83c9c6bc70d62e.js",
    "revision": "65f0bfffee145d91a5e942d5a197c491"
  },
  {
    "url": "/_nuxt/3119df76d272546340f0.js",
    "revision": "80fa8389c50f68bb25118a16acceb9af"
  },
  {
    "url": "/_nuxt/49000114a8331375550f.js",
    "revision": "61f17b0e7a001304b180ae6c35f9b0af"
  },
  {
    "url": "/_nuxt/511d6d7ba920a56f5ad0.js",
    "revision": "851a05e9979224e0c9ff8b63b5acf324"
  },
  {
    "url": "/_nuxt/5149f5f0d60fe5ab5b6b.js",
    "revision": "de16dafaeedb146a4a29ed5c642cb575"
  },
  {
    "url": "/_nuxt/a93c3ce6fbc499996a0a.js",
    "revision": "6d723dcd2b8b3130adfc1dae7fe8eaab"
  },
  {
    "url": "/_nuxt/ded390f9d0759353d92c.js",
    "revision": "905296d720261565d1cdb87c8a02fe2f"
  },
  {
    "url": "/_nuxt/fca77a9cb48b1f43499e.js",
    "revision": "8b20655ede76bbb6a0e7adab87a9839a"
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
