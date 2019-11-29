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
    const { story, stories } = await this.$api.stories.fetch(params)
    if (params.id) {
      commit('add', story)
    } else {
      commit('setList', stories)
    }
  },

  clear({ commit }) {
    commit('clear')
  },

  add({ commit }, params) {
    return this.$api.stories.add(params)
  },

  async love({ commit, dispatch }, params) {
    await this.$api.stories.love(params.id)
    await dispatch('fetch', params)
  },

  async unlove({ commit, dispatch }, params) {
    await this.$api.stories.unlove(params.id)
    await dispatch('fetch', params)
  }
}
