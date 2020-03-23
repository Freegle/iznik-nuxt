import Vue from 'vue'

export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  list: {}
})

export const mutations = {
  add(state, item) {
    Vue.set(state.list, item.id, item)
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

  clearAdmin(state, id) {
    Vue.delete(state.list, id)
  }
}

export const getters = {
  get: state => id => {
    let ret = null

    Object.keys(state.list).forEach(key => {
      const item = state.list[key]

      if (parseInt(key) === parseInt(id)) {
        ret = item
      }
    })

    return ret
  },

  list: state => {
    return state.list
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const { admin, admins } = await this.$api.admins.fetch(params)
    if (params && params.id) {
      commit('add', admin)
    } else {
      commit('setList', admins)
    }
  },

  clear({ commit }) {
    commit('clear')
  },

  add({ commit }, params) {
    return this.$api.admins.add(params)
  },

  async edit({ commit }, params) {
    await this.$api.admins.patch(params)
    const { admin } = await this.$api.admins.fetch(params)
    commit('add', admin)
  },

  async approve({ commit }, params) {
    await this.$api.admins.patch({
      id: params.id,
      pending: 0
    })

    const { admin } = await this.$api.admins.fetch(params)
    commit('add', admin)
  },

  async delete({ commit }, params) {
    await this.$api.admins.del(params)
    commit('clearAdmin', params.id)
  }
}
