// We may be using a CDN.  If so then we can force webpack to load chunks from there.
console.log('Consider CDN', process.client, process.env.CDN)
if (process.client && process.env.CDN) {
  // eslint-disable-next-line no-undef,camelcase
  __webpack_public_path__ = process.env.CDN + '/_nuxt'
}
