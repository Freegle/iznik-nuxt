// Nuxt Auth strategy to handle the way we do native logins.
const querystring = require('querystring')

export default class nativeStrategy {
  constructor (auth, options) {
    this.$auth = auth
    this.name = options._name

    this.options = Object.assign({}, options)
  }

  mounted () {
    return this.$auth.fetchUserOnce()
  }

  async login (params) {
    // Ditch any leftover local tokens before attempting to log in
    await this._logoutLocally()

    const result = await this.$auth.request(
      params,
      { url: process.env.API + '/session', method: 'POST' }
    )

    // The result has a persistent token we can use on future requests.
    console.log("Login result", result)

    if (result.ret !== 0) {
      throw new Exception(result)
    }

    this.$auth.setToken(this.name, JSON.stringify(result.persistent))

    return this.fetchUser()
  }

  async setUserToken (tokenValue) {
    console.log("setUserToken")
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
    let url = process.env.API + '/session'
    let token = this.$auth.getToken(this.name)

    if (token) {
      // We have to encode up the token the right way for our server.
      token = {
        persistent: JSON.parse(token)
      };

      let encoded = this.serialize(token)
      url += '?' + encoded
    }

    // We're so vain, we probably think this API call is about us.
    url += '&components%5B%5D=me'

    const user = await this.$auth.requestWith(
      this.name,
      params,
      {
        url: url,
        method: 'GET',
        propertyName: 'me',
      }
    )

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
    if (this.options.tokenRequired) {
      this._clearToken()
    }

    return this.$auth.reset()
  }
}
