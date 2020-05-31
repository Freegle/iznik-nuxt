import Vue from 'vue'

export const state = () => ({
  list: {},
  properties: {},
  selected: null
})

export const mutations = {
  set(state, list) {
    if (list) {
      for (const item of list) {
        Vue.set(state.list, item.id, item)
      }
    }
  },

  setProperties(state, list) {
    if (list) {
      for (const item of list) {
        Vue.set(state.properties, item.id, item)
      }
    }
  },

  select(state, id) {
    state.selected = id
  },

  clear(state) {
    state.list = {}
  },

  clearProperties(state) {
    state.properties = {}
  }
}

export const getters = {
  list: state => {
    return state.list
  },

  properties: state => {
    return state.properties
  },

  selected: state => {
    const addresses = Object.values(state.list)

    if (state.selected) {
      // We have remembered a preferred address.
      return state.selected
    } else if (addresses.length) {
      // Just return one of them.
      return addresses[0].id
    } else {
      return null
    }
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const { addresses, address } = await this.$api.address.fetch(params)
    if (addresses) {
      commit('clear')
      commit('set', addresses)
    } else {
      commit('set', [address])
    }
  },

  async fetchProperties({ commit }, params) {
    const { addresses } = await this.$api.address.fetch(params)
    commit('clearProperties')
    commit('setProperties', addresses)
  },

  async delete({ commit, getters, dispatch }, params) {
    await this.$api.address.del(params.id)
    await dispatch('fetch')
  },

  async add({ commit, getters, dispatch }, params) {
    const { id } = await this.$api.address.add(params)
    await dispatch('fetch', { id })
    return id
  },

  async update({ commit, getters, dispatch }, params) {
    await this.$api.address.update(params)
    await dispatch('fetch', { id: params.id })
  },

  select({ commit }, id) {
    commit('select', id)
  }
}
