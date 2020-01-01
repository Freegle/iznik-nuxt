/**
 * Set the axios baseURL depending on whether we are server or client.
 *
 *   server:
 *
 *     - set baseURL to IZNIK_API, which is the actual host serving the API.
 *     - makes requests to the directly to the API
 *     - we don't need to worry about the CORS stuff
 *
 *   client:
 *
 *     - don't set baseURL
 *     - makes API requests to current hostname in browser
 *     - the backend that served us is responsible for proxying to the right
 *       place via the proxy: in nuxt.config.
 *
 */
export default function({ $axios }) {
  if (process.server) {
    $axios.defaults.baseURL = process.env.IZNIK_API
  }
}
