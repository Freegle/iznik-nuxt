import Vue from 'vue'

export const state = () => ({
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
  }
}

export const getters = {
  list: state => {
    return state.list
  },
  get: state => id => {
    id = parseInt(id)
    return state.list[id] ? state.list[id] : null
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const { isochrone, isochrones } = await this.$api.isochrone.fetch(params)
    commit('setList', isochrone ? [isochrone] : isochrones)
  },

  async delete({ commit, getters, dispatch }, { id }) {
    await this.$api.isochrone.del(id)
    await dispatch('fetch')
  },

  async add({ commit, getters, dispatch }, params) {
    const id = await this.$api.isochrone.add(params)
    await dispatch('fetch', { id })
    return id
  },

  async edit({ commit, getters, dispatch }, params) {
    await this.$api.isochrone.patch({
      id: params.id,
      transport: params.transport,
      minutes: params.minutes
    })

    await dispatch('fetch', { id: params.id })
  }
}
