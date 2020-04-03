import Vue from 'vue'
import { LoginError, SignUpError } from '../api/BaseAPI'

let first = true

export const state = () => ({
  forceLogin: false,
  user: null,
  userFetched: null,
  groups: [],
  nchan: null,
  loggedInEver: false,
  userlist: [],
  work: [],
  discourse: {},
  loginType: null
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
        // Set everything, because that's what we fetched.
        state.user = []

        for (const key in user) {
          Vue.set(state.user, key, user[key])
        }
      }

      // Remember that we have successfully logged in at some point.
      state.loggedInEver = true

      // Ensure we don't store the password.
      delete state.user.password
    } else if (state.user || state.user === {}) {
      state.user = null
      state.userFetched = null
    }
  },

  addRelated(state, id) {
    // Keep track of which users we log in as.
    if (!state.userlist) {
      state.userlist = []
    }

    if (state.userlist.indexOf(id) === -1) {
      if (state.userlist.length > 9) {
        state.userlist.pop()
      }

      state.userlist.unshift(id)
    }
  },

  unbounce(state) {
    state.user.bouncing = 0
  },

  setLoggedInEver(state, value) {
    state.loggedInEver = value
  },

  setGroups(state, groups) {
    state.groups = groups
  },

  setWork(state, work) {
    state.work = work
  },

  setDiscourse(state, work) {
    state.discourse = work
  },

  setFetched(state, val) {
    state.userFetched = val
  },

  setNCHAN(state, val) {
    state.nchan = val
  },

  setLoginType(state, val) {
    state.loginType = val
  }
}

export const getters = {
  forceLogin: state => {
    return state.forceLogin
  },

  loggedInEver: state => {
    return state.loggedInEver
  },

  user: state => {
    const ret = state.user
    return ret
  },

  work: state => {
    const ret = state.work
    return ret
  },

  discourse: state => {
    const ret = state.discourse
    return ret
  },

  groups: state => {
    return state.groups
  },

  groupById: state => id => {
    return state.groups.find(g => parseInt(g.id) === id)
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

  nchan: state => {
    return state.nchan
  },

  loginType: state => {
    return state.loginType
  }
}

export const actions = {
  forceLogin({ commit }, value) {
    commit('forceLogin', value)
  },

  logout({ commit }) {
    commit('setUser', null)
    this.$api.session.logout()
    this.$axios.defaults.headers.common.Authorization = null
  },

  async forget({ dispatch }) {
    this.$api.session.forget()
    await this.$api.session.forget()
    await dispatch('logout')
  },

  setUser({ commit }, value) {
    commit('setUser', value)

    if (value) {
      commit('addRelated', value.id)
    }

    // Set or clear our auth token to be used on all API requests.
    this.$axios.defaults.headers.common.Authorization = value
      ? 'Iznik ' + value.persistent
      : null
  },

  async login({ commit, dispatch, state }, params) {
    const res = await this.$api.session.login(params)
    const { ret, status, user, persistent } = res

    if (ret === 0) {
      // Successful login.
      //
      // Login no longer required (if it was)
      commit('forceLogin', false)

      // Save the persistent session token.
      user.persistent = persistent

      // Login succeeded.  Set the user, which will trigger various rerendering if we were required to be logged in.
      commit('setUser', user)
      commit('addRelated', user.id)

      // We need to fetch the user again to get the groups, which aren't returned by the login API.
      dispatch(
        'fetchUser',
        {
          components: ['me', 'groups']
        },
        true
      )

      if (state.userlist.length > 1) {
        // Logged in as multiple users.  Let the server know.
        await this.$api.session.related(state.userlist)
      }
    } else {
      // Login failed.
      throw new LoginError(ret, status)
    }
  },

  async lostPassword({ commit, dispatch }, params) {
    await this.$axios.post(process.env.API + '/session', {
      action: 'LostPassword',
      email: params.email
    })
  },

  async unsubscribe({ commit, dispatch }, params) {
    const res = await this.$axios.post(process.env.API + '/session', {
      action: 'Unsubscribe',
      email: params.email
    })

    return res.data
  },

  async signup({ commit, dispatch }, params) {
    const res = await this.$axios.post(process.env.API + '/user', params, {
      headers: {
        'X-HTTP-Method-Override': 'PUT'
      }
    })
    const { ret, status } = res.data

    if (res.status === 200 && res.data.ret === 0) {
      commit('forceLogin', false)

      // We need to fetch the user to get the groups, persistent token etc.
      dispatch('fetchUser', {
        components: ['me', 'groups']
      })
    } else {
      // Sign up failed.
      throw new SignUpError(ret, status)
    }
  },

  async fetchUser({ commit, store, dispatch, state }, params) {
    const lastfetch = state.userFetched

    params = params || {
      components: ['me', 'groups']
    }

    // Always fetch the number of replies we're expecting.
    params.components.push('expectedreplies')

    // If we have recently fetched the user without the groups, but we want them now, then ensure we refetch.
    for (const component of params.components) {
      if (component !== 'me' && state.user && !state.user[component]) {
        params.force = true
      }
    }

    if (
      !first &&
      !params.force &&
      lastfetch &&
      Date.now() - lastfetch < 30000
    ) {
      // We have fetched the user pretty recently.
    } else {
      // We're so vain, we probably think this call is about us.
      first = false

      // Set the time now; this avoids multiple fetches at the start of page loads.
      commit('setFetched', Date.now())

      const {
        me,
        persistent,
        groups,
        work,
        discourse
      } = await this.$api.session.fetch(params)

      if (me) {
        // Save the persistent session token.
        me.persistent = persistent

        if (groups && groups.length) {
          me.groups = groups
          commit('setGroups', groups)
        } else if (params.components.indexOf('groups')) {
          // We asked for groups but got none, so we're not a member of any.
          commit('setGroups', [])
        }

        // Set the user, which will trigger various re-rendering if we were required to be logged in.
        commit('setUser', me, params.components)
        commit('addRelated', me.id)
        commit('forceLogin', false)
      }

      if (work) {
        commit('setWork', work)
      }

      if (discourse) {
        commit('setDiscourse', discourse)
      }
    }
  },

  async saveAboutMe({ commit, dispatch }, value) {
    await dispatch('saveAndGet', {
      aboutme: value
    })
  },

  async saveEmail({ commit, dispatch, state }, params) {
    const data = await this.$api.session.save(params)
    await dispatch('fetchUser', {
      components: NONMIN
    })
    return data
  },

  async unbounce({ commit, dispatch, state }, params) {
    await this.$api.user.unbounce(params.id)
    commit('unbounce')
  },

  async saveAndGet({ commit, dispatch, state }, params) {
    await this.$api.session.save(params)
    await dispatch('fetchUser', {
      components: NONMIN,
      force: true
    })
    return state.user
  },

  async setGroup({ commit, dispatch, state }, params) {
    await this.$api.memberships.update(params)
  },

  async leaveGroup({ commit, dispatch, state }, params) {
    await this.$api.memberships.leaveGroup(params)
    await dispatch('fetchUser', {
      components: NONMIN,
      force: true
    })
    return state.user
  },

  async joinGroup({ commit, dispatch, state }, params) {
    await this.$api.memberships.joinGroup(params)
    await dispatch('fetchUser', {
      components: NONMIN,
      force: true
    })
    return state.user
  },

  setNCHAN({ commit, dispatch, state }, params) {
    commit('setNCHAN', params)
  },

  loggedInEver({ commit }, value) {
    commit('setLoggedInEver', value)
  },

  async addRelatedUser({ state, commit, dispatch }, params) {
    console.log('add Related', params.id)
    commit('addRelated', params.id)

    if (state.userlist.length > 1) {
      // Logged in as multiple users.  Let the server know.
      await this.$api.session.related(state.userlist)
    }
  },

  setLoginType({ commit }, value) {
    commit('setLoginType', value)
  }
}
