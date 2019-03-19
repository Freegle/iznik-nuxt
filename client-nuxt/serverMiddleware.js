export default function(req, res, next) {
  console.log("Server middleware on ", req ? req.originalUrl : 'undefined')

  if (req && req.originalUrl === '/login') {
    // On the login page, trigger the SPA mode.  This means that the security middleware will execute on the client
    // and check with the server whether we are logged in. We can't do that here because we don't have access to the
    // token which is persisted in local storage.
    console.log("Force SPA")
    res.spa = true
  } else {
    console.log("Allow SSR")
  }

  next()
}