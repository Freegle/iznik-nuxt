// TODO HARD All this loginRequired/loginOptional stuff seems like hard work.  I've seen at least one undiagnosed
// bug.  Is there really not a better way to do it?  For example, if we used local storage directly, maybe we
// could simplify some of the issues that arise because the Vuex persisted store is loaded later rather than sooner.
// There are definitely still some of these - I've seen the navbar show us logged in while the page contents show us
// logged out.  Can we force the persisted store to be loaded earlier to knock this class of bugs on the head?

import Vue from 'vue'
import { LoginError } from '../api/BaseAPI'
import { mobilestate } from '@/plugins/initapp' // CC

let first = true

export const state = () => ({
  forceLogin: false,
  user: null,
  userFetched: null,
  groups: [],
  nchan: null,
  loggedInEver: false
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

      // Remember that we have successfully logged in at some point.
      state.loggedInEver = true
    } else if (state.user || state.user === {}) {
      state.user = null
      state.userFetched = null
    }
  },

  setLoggedInEver(state, value) {
    state.loggedInEver = value
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

    // Set or clear our auth token to be used on all API requests.
    this.$axios.defaults.headers.common.Authorization = value
      ? 'Iznik ' + value.persistent
      : null

    console.log('auth.setUser ',value?value.persistent:'null')
  },

  async login({ commit, dispatch }, params) {
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

      // We need to fetch the user again to get the groups, which aren't returned by the login API.
      dispatch('fetchUser')
    } else {
      // Login failed.
      throw new LoginError(ret, status)
    }
  },

  async signup({ commit, dispatch }, params) {
    const res = await this.$axios.post(process.env.API + '/user', params, {
      headers: {
        'X-HTTP-Method-Override': 'PUT'
      }
    })

    if (res.status === 200 && res.data.ret === 0) {
      commit('forceLogin', false)

      // We need to fetch the user to get the groups, persistent token etc.
      dispatch('fetchUser')
    } else {
      // Sign up failed.
      // TODO Display some kind of error.  May now work but needs testing.
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
      Date.now() - lastfetch < 30000
    ) {
      // We have fetched the user pretty recently.
    } else {
      // We're so vain, we probably think this call is about us.
      first = false

      // Set the time now; this avoids multiple fetches at the start of page loads.
      commit('setFetched', Date.now())

      const { me, persistent, groups } = await this.$api.session.fetch(params)

      // Save the persistent session token.
      me.persistent = persistent

      if (groups) {
        me.groups = groups
        commit('setGroups', groups)
      }

      // Set the user, which will trigger various re-rendering if we were required to be logged in.
      if (me) {
        commit('setUser', me, params.components)
        commit('forceLogin', false)

        // Tell server our push notification id
        console.log('mobilestate', mobilestate)
        if (mobilestate.mobilePushId) {
          const params = {
            notifications: {
              push: {
                type: mobilestate.isiOS ? 'FCMIOS' : 'FCMAndroid',
                subscription: mobilestate.mobilePushId
              }
            }
          }
          await this.$api.session.save(params)
          console.log('auth.fetchUser mobilePushId sent to server')
        }

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
      components: ['me', 'groups', 'aboutme']
    })
    return data
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
  }
}
