import Vue from 'vue'

export default class OurFacebookScheme {
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
    console.log("Facebook login")
    // TODO Do we still have the Chrome on IOS problem?
    // Ditch any leftover local tokens before attempting to log in
    await this._logoutLocally()

    let response = null
    let promise = new Promise(function(resolve, reject) {
      Vue.FB.login(function(ret) {
        console.log("Returned in promise", ret)
        response = ret
        resolve()
      })
    })

    await promise
    console.log("Returned after promise", response)
    if (response.authResponse) {
      let accessToken = response.authResponse.accessToken
      console.log("Now login on server", accessToken)

      const result = await this.$auth.request(
        {
          data: {
            fblogin: 1,
            fbaccesstoken: accessToken
          }
        },
        { url: process.env.API + '/session', method: 'POST' }
      )

      console.log("Returned", result)
      if (result.ret !== 0) {
        console.error("Server login for Facebook failed", result)
        throw result
      }

      // The result has a persistent token we can use on future requests.
      let persistent = JSON.stringify(result.persistent)
      this._setHeader(persistent)
      this.$auth.setToken(this.name, 'Iznik ' + persistent)
      return this.fetchUser()
    } else {
      console.error('User cancelled Facebook login or did not fully authorize.');
      return(null)
    }
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

    if (ret.me) {
      // Save off the logged in user.  Include the persistent token which we may need on the client side.
      ret.me.persistent = ret.persistent
    }

    console.log("Set user", ret.me)
    this.$auth.setUser(ret.me)
    console.log("After set", JSON.stringify(this.$auth.$storage.ctx.store));

    // Save off the returned groups
    let groups = []

    if (ret.groups) {
      for (let group of ret.groups) {
        if (process.env.MODTOOLS || (group.publish && group.type === 'Freegle')) {
          groups.push(group)
        }
      }

      this.$auth.ctx.store.commit('group/setList', groups)
    }

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
