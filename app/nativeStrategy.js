// Nuxt Auth strategy to handle the way we do native logins.
const querystring = require('querystring')

export default class nativeStrategy {
  constructor (auth, options) {
    this.$auth = auth
    this.name = options._name

    this.options = Object.assign({}, options)
  }

  mounted () {
    console.log("Mounted, sync token")
    const persistent = this.$auth.syncToken(this.name)
    console.log("Got token", persistent)
    this._setHeader(persistent)
    return this.$auth.fetchUserOnce()
  }

  _setHeader (persistent) {
    /// Set our persistent token as a header for all requests.  This will mean the server will pick it up.
    this.$auth.ctx.app.$axios.setHeader('X-Iznik-Persistent', persistent)
  }

  async login (params) {
    console.log("Login with", params);
    // Ditch any leftover local tokens before attempting to log in
    await this._logoutLocally()


    const result = await this.$auth.request(
      params,
      { url: process.env.API + '/session', method: 'POST' }
    )

    // The result has a persistent token we can use on future requests.
    console.log("Login result", result)

    if (result.ret !== 0) {
      throw new result
    }

    let persistent = JSON.stringify(result.persistent)
    this._setHeader(persistent)
    this.$auth.setToken(this.name, persistent)

    return this.fetchUser()
  }

  serialize(obj, prefix) {
    var str = [],
      p;
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p,
          v = obj[p];
        str.push((v !== null && typeof v === "object") ?
          this.serialize(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  }

  async fetchUser (params) {
    console.log("Fetch user");
    let url = process.env.API + '/session'
    let token = this.$auth.getToken(this.name)
    console.log("Got token", token)

    // if (token) {
    //   // We have to encode up the token the right way for our server.
    //   token = {
    //     persistent: JSON.parse(token)
    //   };
    //
    //   let encoded = this.serialize(token)
    //   url += '?' + encoded
    // }
    //
    // // We're so vain, we probably think this API call is about us.
    // url += '&components%5B%5D=me'
    url += '?components%5B%5D=me'

    console.log("Await user");
    const user = await this.$auth.requestWith(
      this.name,
      params,
      {
        url: url,
        method: 'GET',
        propertyName: 'me',
      }
    )

    console.log("Got user", user)
    // Save off the logged in user.
    this.$auth.setUser(user)
  }

  async logout (params) {
    await this.$auth
      .requestWith(this.name,
        params,
        { url: process.env.API + '/session', method: 'DELETE' })
      .catch(() => { })

    return this._logoutLocally()
  }

  async _logoutLocally () {
    this._setHeader(false)
    return this.$auth.reset()
  }
}
