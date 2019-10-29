// TODO HARD All this loginRequired/loginOptional stuff seems like hard work.  I've seen at least one undiagnosed
// bug.  Is there really not a better way to do it?  For example, if we used local storage directly, maybe we
// could simplify some of the issues that arise because the Vuex persisted store is loaded later rather than sooner.
let first = true

export const state = () => ({
  forceLogin: false,
  user: null,
  userFetched: null,
  groups: [],
  nchan: null
})

const NONMIN = ['me', 'groups', 'aboutme', 'phone', 'notifications']

export const mutations = {
  forceLogin(state, value) {
    if (state.forceLogin !== value) {
      state.forceLogin = value
    }
  },

  setUser(state, user, components) {
    if (user) {
      // We can query the server for different components.  Merge everything we have back in.
      if (!state.user) {
        state.user = {}
      }

      if (components) {
        // Just merge in what we fetched; leave other things there.  Otherwise we lose info for some pages.
        for (const component of components) {
          state.user[component] = user[component]
        }
      } else {
        // Merge everything, because that's what we fetched.
        for (const key in user) {
          state.user[key] = user[key]
        }
      }
    } else if (state.user) {
      state.user = null
      state.userFetched = null
    }
  },

  setGroups(state, groups) {
    state.groups = groups
  },

  setFetched(state, val) {
    state.userFetched = val
  },

  setNCHAN(state, val) {
    state.nchan = val
  }
}

export const getters = {
  forceLogin: state => () => {
    return state.forceLogin
  },

  user: state => () => {
    return state.user
  },

  groups: state => () => {
    return state.groups
  },

  member: state => id => {
    let ret = false

    for (const group of state.groups) {
      if (parseInt(group.id) === parseInt(id)) {
        ret = group.role ? group.role : group.myrole
      }
    }

    return ret
  },

  nchan: state => () => {
    return state.nchan
  }
}

export const actions = {
  forceLogin({ commit }, value) {
    commit('forceLogin', value)
  },

  logout({ commit }) {
    commit('setUser', null)

    this.$axios.post(process.env.API + '/session', [], {
      headers: {
        'X-HTTP-Method-Override': 'DELETE'
      }
    })

    this.$axios.defaults.headers.common.Authorization = null
  },

  setUser({ commit }, value) {
    console.log('Set user', value)
    commit('setUser', value)

    // Set or clear our auth token to be used on all API requests.
    this.$axios.defaults.headers.common.Authorization = value
      ? 'Iznik ' + value.persistent
      : null
  },

  async login({ commit, dispatch }, params) {
    const res = await this.$axios.post(process.env.API + '/session', params)

    if (res.status === 200 && res.data.ret === 0) {
      // Login no longer required (if it was)
      commit('forceLogin', false)

      // Save the persistent session token.
      res.data.user.persistent = res.data.persistent

      // Login succeeded.  Set the user, which will trigger various rerendering if we were required to be logged in.
      commit('setUser', res.data.user)

      // We need to fetch the user again to get the groups, which aren't returned by the login API.
      dispatch('fetchUser')
    } else {
      // Login failed.
      console.error('Login failed', res)
      throw new Error('Login failed')
    }
  },

  async fetchUser({ commit, store, dispatch, state }, params) {
    const lastfetch = state.userFetched

    params = params || {
      components: ['me', 'groups']
    }

    if (
      !first &&
      !params.force &&
      lastfetch &&
      new Date().getTime() - lastfetch < 30000
    ) {
      // We have fetched the user pretty recently.
    } else {
      // We're so vain, we probably think this call is about us.
      first = false

      // Set the time now; this avoids multiple fetches at the start of page loads.
      commit('setFetched', new Date().getTime())

      const res = await this.$axios.get(process.env.API + '/session', {
        params: params
      })

      if (res.status === 200 && res.data.ret === 0) {
        // Save the persistent session token.
        res.data.me.persistent = res.data.persistent

        if (res.data.groups) {
          res.data.me.groups = res.data.groups
          commit('setGroups', res.data.groups)
        }

        // Login succeeded.  Set the user, which will trigger various re-rendering if we were required to be logged in.
        if (res.data.me) {
          commit('setUser', res.data.me, params.components)
          commit('forceLogin', false)
        }
      } else {
        // Login failed.
        console.error('Fetch user failed')
        throw new Error('Fetch user failed')
      }
    }
  },

  async saveAboutMe({ commit, dispatch }, value) {
    await dispatch('saveAndGet', {
      aboutme: value
    })
  },

  async saveEmail({ commit, dispatch, state }, params) {
    const res = await this.$axios.post(process.env.API + '/session', params, {
      headers: {
        'X-HTTP-Method-Override': 'PATCH'
      }
    })

    if (res.status === 200 && res.data.ret === 0) {
      await dispatch('fetchUser', {
        components: ['me', 'groups', 'aboutme']
      })
    } else {
      // TODO
      console.error('saveUser failed')
    }

    return res
  },

  async saveAndGet({ commit, dispatch, state }, params) {
    const res = await this.$axios.post(process.env.API + '/session', params, {
      headers: {
        'X-HTTP-Method-Override': 'PATCH'
      }
    })

    if (res.status === 200 && res.data.ret === 0) {
      await dispatch('fetchUser', {
        components: NONMIN,
        force: true
      })
    } else {
      // TODO
      console.error('saveUser failed')
    }

    return state.user
  },

  async setGroup({ commit, dispatch, state }, params) {
    await this.$axios.post(process.env.API + '/memberships', params, {
      headers: {
        'X-HTTP-Method-Override': 'PATCH'
      }
    })
  },

  async leaveGroup({ commit, dispatch, state }, params) {
    const res = await this.$axios.post(
      process.env.API + '/memberships',
      params,
      {
        headers: {
          'X-HTTP-Method-Override': 'DELETE'
        }
      }
    )

    if (res.status === 200 && res.data.ret === 0) {
      await dispatch('fetchUser', {
        components: NONMIN,
        force: true
      })
    } else {
      // TODO
      console.error('saveUser failed')
    }

    return state.user
  },

  async joinGroup({ commit, dispatch, state }, params) {
    const res = await this.$axios.post(
      process.env.API + '/memberships',
      params,
      {
        headers: {
          'X-HTTP-Method-Override': 'PUT'
        }
      }
    )

    if (res.status === 200 && res.data.ret === 0) {
      await dispatch('fetchUser', {
        components: NONMIN,
        force: true
      })
    } else {
      // TODO
      console.error('saveUser failed')
    }

    return state.user
  },

  setNCHAN({ commit, dispatch, state }, params) {
    commit('setNCHAN', params)
  }
}
