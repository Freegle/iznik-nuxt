// Nuxt Auth strategy to handle the way we do native logins.
const querystring = require('querystring')

export default class nativeStrategy {
  constructor (auth, options) {
    this.$auth = auth
    this.name = options._name

    this.options = Object.assign({}, options)
  }

  mounted () {
    const persistent = this.$auth.syncToken(this.name)
    return this.$auth.fetchUserOnce()
  }

  _setHeader (persistent) {
    /// Set our persistent token as a header for all requests.  This will mean the server will pick it up.
    if (typeof persistent !== 'string') {
      persistent = JSON.stringify(persistent);
    }

    this.$auth.ctx.app.$axios.defaults.headers.common['Authorization'] = 'Iznik ' + persistent;
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
    this._setHeader(persistent)
    this.$auth.setToken(this.name, 'Iznik ' + persistent)

    return this.fetchUser()
  }

  async fetchUser (params) {
    let url = process.env.API + '/session'

    // We're so vain, we probably think this API call is about us.  Grab the groups at the same time.
    url += '?components%5B%5D=me&components%5B%5D=groups'

    const ret = await this.$auth.requestWith(
      this.name,
      params,
      {
        url: url,
        method: 'GET',
        propertyName: null,
      }
    )

    // Save off the logged in user.
    this.$auth.setUser(ret.me)

    // Save off the returned groups
    let groups = []
    for (let group of ret.groups) {
      if (process.env.MODTOOLS || (group.publish && group.type === 'Freegle')) {
        groups.push(group)
      }
    }

    this.$auth.ctx.store.commit('group/setList', groups)

    // If we have a persistent token, set it as a default header for all subsequent requests.
    if (ret.persistent) {
      this.$auth.ctx.app.$axios.defaults.headers.common['Authorization'] = 'Iznik ' + JSON.stringify(ret.persistent);
    }
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
