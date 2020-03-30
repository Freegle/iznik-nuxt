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
    await this.$api.locations.del(params.id)
    await dispatch('fetch')
  },

  async add({ commit, getters, dispatch }, params) {
    const { id } = await this.$api.locations.add(params)
    await dispatch('fetch', { id })
    return id
  },

  async update({ commit, getters, dispatch }, params) {
    await this.$api.locations.update(params)
    await dispatch('fetch', { id: params.id })
  }
}
