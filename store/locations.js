import Vue from 'vue'

export const state = () => ({
  list: {},
  dodgy: {}
})

export const mutations = {
  set(state, list) {
    if (list) {
      for (const item of list) {
        if (item && item.id) {
          Vue.set(state.list, item.id, item)
        }
      }
    }
  },

  setDodgy(state, list) {
    state.dodgy = list
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
  },

  dodgy: state => {
    return state.dodgy
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const { locations, location, dodgy } = await this.$api.location.fetch(
      params
    )

    if (dodgy) {
      commit('setDodgy', dodgy)
    }

    if (locations) {
      commit('clear')
      commit('set', locations)
      return locations
    } else {
      commit('set', [location])
      return location
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
