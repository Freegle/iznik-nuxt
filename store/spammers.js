import Vue from 'vue'
import cloneDeep from 'lodash.clonedeep'

export const state = () => ({
  // Use array because we need to store them in the order returned by the server.
  list: [],

  // The context from the last fetch, used for fetchMore.
  context: null,

  // For spotting when we clear under the feet of an outstanding fetch
  instance: 1
})

export const mutations = {
  addAll(state, items) {
    items.forEach(item => {
      item.user.userid = item.user.id

      const existing = state.list.findIndex(obj => {
        return parseInt(obj.id) === parseInt(item.id)
      })

      if (existing !== -1) {
        // Ensure userid is set - used by member views.
        Vue.set(state.list, existing, item)
      } else {
        state.list.push(item)
      }
    })
  },
  remove(state, item) {
    state.list = state.list.filter(obj => {
      return parseInt(item.id) !== parseInt(obj.id)
    })
  },
  clear(state) {
    state.list = []

    if (state.instance) {
      state.instance++
    } else {
      state.instance = 1
    }
  },
  setContext(state, ctx) {
    state.context = ctx
  }
}

export const getters = {
  getContext: state => {
    let ret = null

    if (state.context && state.context.id) {
      ret = state.context
    }

    return ret
  },
  list: state => collection => {
    return state.list.filter(s => s.collection === collection)
  }
}

export const actions = {
  async fetch({ commit, state }, params) {
    // Watch out for the store being cleared under the feet of this fetch. If that happens then we throw away the
    // results.
    const instance = state.instance

    if (params.context) {
      // Ensure the context is a real object, in case it has been in the store.
      const ctx = cloneDeep(params.context)
      params.context = ctx
    } else if (state.context) {
      params.context = state.context
    }

    const { spammers, context } = await this.$api.spammers.fetch(params)
    if (state.instance === instance) {
      commit('addAll', spammers)
      commit('setContext', context)
    }
  },

  async report({ commit, dispatch }, params) {
    await this.$api.spammers.add({
      userid: params.userid,
      collection: 'PendingAdd',
      reason: params.reason
    })

    dispatch(
      'auth/fetchUser',
      {
        components: ['work'],
        force: true
      },
      {
        root: true
      }
    )
  },

  async confirm({ commit, dispatch }, params) {
    await this.$api.spammers.patch({
      id: params.id,
      userid: params.userid,
      collection: 'Spammer'
    })

    dispatch(
      'auth/fetchUser',
      {
        components: ['work'],
        force: true
      },
      {
        root: true
      }
    )
  },

  async requestremove({ commit, dispatch }, params) {
    await this.$api.spammers.add({
      id: params.id,
      userid: params.userid,
      collection: 'PendingRemove'
    })

    dispatch(
      'auth/fetchUser',
      {
        components: ['work'],
        force: true
      },
      {
        root: true
      }
    )
  },

  async remove({ commit, dispatch }, params) {
    await this.$api.spammers.del({
      id: params.id,
      userid: params.userid
    })

    dispatch(
      'auth/fetchUser',
      {
        components: ['work'],
        force: true
      },
      {
        root: true
      }
    )
  },

  async whitelist({ commit, dispatch }, params) {
    await this.$api.spammers.patch({
      id: params.id,
      userid: params.userid,
      collection: 'Whitelisted'
    })

    dispatch(
      'auth/fetchUser',
      {
        components: ['work'],
        force: true
      },
      {
        root: true
      }
    )
  },

  clear({ commit }) {
    commit('clear')
    commit('setContext', null)
  }
}
