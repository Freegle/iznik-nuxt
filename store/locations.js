import Vue from 'vue'

export const state = () => ({
  list: {}
})

export const mutations = {
  set(state, list) {
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
    return state.id
  },

  list: state => {
    return state.list
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const { locations, location } = await this.$api.location.fetch(params)

    if (locations) {
      commit('clear')
      commit('set', locations)
    } else {
      commit('set', [location])
    }
  },

  async delete({ commit, getters, dispatch }, params) {
    await this.$api.location.del(params.id, params.groupid)
    // Server doesn't support fetching of an individual location so we don't fetch.
    commit('clearOne', params.id)
  },

  async add({ commit, getters, dispatch }, params) {
    const { id } = await this.$api.location.add(params)

    // Server doesn't support fetching of an individual location so we don't fetch.
    return id
  },

  async update({ commit, getters, dispatch }, params) {
    await this.$api.location.update(params)
    // Server doesn't support fetching of an individual location so we don't fetch.
  }
}
