// We can log in with u=uid and k=val.
import axios from 'axios'
const url = require('url')

export default function(req, res, next) {
  const parsed = url.parse(req.url, true)
  console.log('Check keylogin')

  if (parsed.query && parsed.query.u && parsed.query.k) {
    // We need to try to log in.
    const uid = parsed.query.u
    const key = parsed.query.k
    console.log('User, ley', uid, key, process.env.API)

    // Log in using the username and key
    const url = (process.env.API || '/api') + '/session'
    console.log('Post to', url)

    const p = axios.post(url, {
      u: uid,
      k: key
    })

    p.then(rsp => {
      console.log('Axios complete', rsp.data.ret)
    })
      .catch(err => {
        console.log('Axios err', err)
      })
      .finally(() => {
        next()
      })

    return p
  }

  // Proceed
  next()
}
