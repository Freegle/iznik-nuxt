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
  }
}

export const getters = {
  list: state => {
    return state.list
  },
  get: state => id => {
    return state.list[id]
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const { noticeboard, noticeboards } = await this.$api.noticeboard.fetch(
      params
    )
    commit('setList', noticeboard ? [noticeboard] : noticeboards)
  },

  async delete({ commit, getters, dispatch }, { id }) {
    await this.$api.noticeboard.del(id)
    await dispatch('fetch')
  },

  async add({ commit, getters, dispatch }, params) {
    const id = await this.$api.noticeboard.add(params)
    await dispatch('fetch', { id })
    return id
  },

  async edit({ commit, getters, dispatch }, params) {
    await this.$api.noticeboard.save(params)
    await dispatch('fetch', { id: params.id })
  },

  async refresh({ commit, getters, dispatch }, params) {
    await this.$api.noticeboard.action({
      action: 'Refreshed',
      id: params.id
    })
    await dispatch('fetch', { id: params.id })
  },

  async decline({ commit, getters, dispatch }, params) {
    await this.$api.noticeboard.action({
      action: 'Declined',
      id: params.id
    })
    await dispatch('fetch', { id: params.id })
  },

  async inactive({ commit, getters, dispatch }, params) {
    await this.$api.noticeboard.action({
      action: 'Inactive',
      id: params.id
    })
    await dispatch('fetch', { id: params.id })
  },

  async comments({ commit, getters, dispatch }, params) {
    await this.$api.noticeboard.action({
      action: 'Comments',
      id: params.id,
      comments: params.comments
    })
    await dispatch('fetch', { id: params.id })
  },

  clear({ commit }) {
    commit('setList', null)
  }
}
