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

  clearAll(state) {
    state.list = {}
  },

  clearOne(state, id) {
    Vue.delete(state.list, id)
  }
}

export const getters = {
  list: state => {
    return state.list
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const { socialaction, socialactions } = await this.$api.socialactions.fetch(
      params
    )
    if (params.id) {
      commit('add', socialaction)
    } else {
      commit('setList', socialactions)
    }
  },

  clear({ commit }) {
    commit('clearAll')
  },

  async share({ commit, dispatch }, params) {
    await this.$api.socialactions.share(params.id, params.uid)
  },

  async hide({ commit, dispatch }, params) {
    await this.$api.socialactions.hide(params.id, params.uid)
  }
}
