// We may be using a CDN.  If so then we can force webpack to load chunks from there.
//
// The hostnames in here match those in ecosystem.config.js.  There's probably a better way to pass this info
// around.
if (process.client) {
  switch (location.hostname) {
    case 'iznik.ilovefreegle.org':
      // eslint-disable-next-line no-undef,camelcase
      __webpack_public_path__ =
        'https://freeglecdndbg.azureedge.net' + '/_nuxt/'
      break
    case 'dev.ilovefreegle.org':
      // eslint-disable-next-line no-undef,camelcase
      __webpack_public_path__ =
        'https://freeglecdndev.azureedge.net' + '/_nuxt/'
      break
    case 'www.ilovefreegle.org':
      // eslint-disable-next-line no-undef,camelcase
      __webpack_public_path__ = 'https://freeglecdn.azureedge.net' + '/_nuxt/'
      break
  }
}
