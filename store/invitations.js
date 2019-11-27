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
    const { invitation, invitations } = await this.$api.invitation.fetch(params)
    commit('setList', invitation ? [invitation] : invitations)
  },

  async delete({ commit, getters, dispatch }, { id }) {
    await this.$api.invitation.del(id)
    await dispatch('fetch')
  },

  async add({ commit, getters, dispatch }, params) {
    const id = await this.$api.invitation.add(params)
    await dispatch('fetch', { id })
    return id
  },

  async edit({ commit, getters, dispatch }, params) {
    await this.$api.invitation.save(params)
    await dispatch('fetch', {
      id: params.id
    })
  }
}
