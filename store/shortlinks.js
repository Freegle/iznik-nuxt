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
  }
}

export const getters = {
  get: state => id => {
    id = parseInt(id)
    return state.list[id] ? state.list[id] : null
  },

  list: state => {
    return state.list
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const { shortlink, shortlinks } = await this.$api.shortlinks.fetch(params)
    if (params && params.id) {
      commit('add', shortlink)
    } else {
      commit('setList', shortlinks)
    }
  },

  clear({ commit }) {
    commit('clear')
  },

  add({ commit }, params) {
    return this.$api.shortlinks.add(params)
  }
}
