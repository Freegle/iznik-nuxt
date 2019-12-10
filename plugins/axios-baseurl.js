/**
 * Set the axios baseURL depending on whether we are server or client.
 *
 *   server:
 *
 *     - set baseURL to IZNIK_API
 *     - makes requests to the directly to the API
 *     - we don't need to worry about the CORS stuff
 *
 *   client:
 *
 *     - no baseURL set
 *     - makes API requests to current hostname in browser
 *     - the backend that served us is responsible for proxying to the right place
 *
 */
export default function({ $axios }) {
  if (process.server) {
    $axios.defaults.baseURL = process.env.IZNIK_API
  }
}
