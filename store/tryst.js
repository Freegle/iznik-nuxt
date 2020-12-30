import Vue from 'vue'

export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  list: {}
})

export const mutations = {
  add(state, item) {
    if (item) {
      Vue.set(state.list, item.id, item)
    } else {
      console.log('Ignore add of empty item')
    }
  },

  setList(state, list) {
    state.list = {}

    if (list) {
      for (const item of list) {
        Vue.set(state.list, item.id, item)
      }
    }
  },

  clear(state) {
    state.list = {}
  },

  clearOne(state, id) {
    Vue.delete(state.list, id)
  }
}

export const getters = {
  get: state => id => {
    id = parseInt(id)
    return state.list[id] ? state.list[id] : null
  },

  getByUser: state => userid => {
    return Object.values(state.list).find(i => {
      return (
        parseInt(i.user1) === parseInt(userid) ||
        parseInt(i.user2) === parseInt(userid)
      )
    })
  },

  list: state => {
    return state.list
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const { tryst, trysts } = await this.$api.tryst.fetch(params)
    if (params && params.id) {
      commit('add', tryst)
    } else {
      commit('setList', trysts)
    }
  },

  clear({ commit }) {
    commit('clear')
  },

  add({ commit, dispatch }, params) {
    const id = this.$api.tryst.add(params)

    if (id) {
      dispatch('fetch', {
        id
      })
    }

    return id
  },

  async delete({ commit }, params) {
    await this.$api.tryst.delete(params)
    commit('clearOne', params.id)
  },

  async edit({ commit, dispatch }, params) {
    await this.$api.tryst.edit(params)
    dispatch('fetch', {
      id: params.id
    })
  }
}
