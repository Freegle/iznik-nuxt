import config from './nuxt.config'

export default function(req, res, next) {
  console.log("Server middleware on ", req ? req.originalUrl : 'undefined')

  if (req && config.forceSPAOn.includes(req.originalUrl)) {
    // Force SPA mode rather than SSR.  There are two common cases:
    // - On the login page.
    // - On a page where we need to be logged in.
    //
    // This means that the middleware will execute on the client rather than the server.  This allows for example
    // checking with the server whether we are logged in. We can't do that here because we don't have access to the
    // token which is persisted in local storage.
    console.log("Force SPA")
    res.spa = true
  } else {
    console.log("Allow SSR")
  }

  next()
}