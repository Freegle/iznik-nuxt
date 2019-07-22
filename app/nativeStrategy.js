// Nuxt Auth strategy to handle the way we do native logins.
const querystring = require('querystring')

export default class nativeStrategy {
  constructor (auth, options) {
    this.$auth = auth
    this.name = options._name

    this.options = Object.assign({}, options)
  }

  mounted () {
    // TODO Do we need this extra user fetch?
    const persistent = this.$auth.syncToken(this.name)
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
    if (result.ret !== 0) {
      throw new result
    }

    let persistent = JSON.stringify(result.persistent)
    this.$auth.setToken(this.name, 'Iznik ' + persistent)

    return this.fetchUser()
  }

  async fetchUser (params) {
    let url = process.env.API + '/session'

    // We're so vain, we probably think this API call is about us.
    url += '?components%5B%5D=me'

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
    let ret = await this.$auth
      .requestWith(this.name,
        params,
        { url: process.env.API + '/session', method: 'DELETE' })
      .catch((e) => {
        console.error("Logout failed", e)
      })

    return this._logoutLocally()
  }

  async _logoutLocally () {
    return this.$auth.reset()
  }
}
