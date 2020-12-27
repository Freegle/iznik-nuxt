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

  clearOne(state, id) {
    Vue.delete(state.list, id)
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
  async list({ commit }, params) {
    const {
      context,
      microvolunteerings
    } = await this.$api.microvolunteering.list(params.context)

    microvolunteerings.forEach(m => {
      commit('add', m)
    })

    return context
  },

  clear({ commit }) {
    commit('clear')
  },

  async challenge({ commit }, types) {
    const item = await this.$api.microvolunteering.challenge(types)

    if (item) {
      commit('add', item)
    }

    return item
  },

  async respond({ commit }, params) {
    await this.$api.microvolunteering.response(params)
  }
}
