import Vue from 'vue'

export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  list: {},
  popularposts: {}
})

export const mutations = {
  add(state, item) {
    Vue.set(state.list, item.id, item)
  },

  setList(state, params) {
    const { list, popularposts } = params
    state.list = {}
    state.popularposts = {}

    if (list) {
      for (const item of list) {
        Vue.set(state.list, item.id, item)
      }
    }

    if (popularposts) {
      for (const item of popularposts) {
        Vue.set(state.popularposts, item.id, item)
      }
    }
  },

  clearAll(state) {
    state.list = {}
    state.popularposts = {}
  },

  clearOne(state, id) {
    Vue.delete(state.list, id)
  }
}

export const getters = {
  list: state => {
    return state.list
  },
  popularposts: state => {
    return state.popularposts
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const {
      socialaction,
      socialactions,
      popularposts
    } = await this.$api.socialactions.fetch(params)
    if (params.id) {
      commit('add', socialaction)
    } else {
      commit('setList', { socialactions, popularposts })
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
  },

  async sharePopularPost({ commit, dispatch }, params) {
    await this.$api.socialactions.sharePopularPost(params.groupid, params.msgid)
  },

  async hidePopularPost({ commit, dispatch }, params) {
    await this.$api.socialactions.hidePopularPost(params.groupid, params.msgid)
  }
}
