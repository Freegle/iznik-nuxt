import Vue from 'vue'

export const state = () => ({
  recentmessages: {}
})

export const mutations = {
  setRecentMessages(state, list) {
    state.recentmessages = {}

    if (list) {
      for (const item of list) {
        Vue.set(state.recentmessages, item.id, item)
      }
    }
  },

  clearRecentMessages(state) {
    state.recentmessages = {}
  }
}

export const getters = {
  listRecentMessages: state => () => {
    return Object.values(state.recentmessages)
  }
}

export const actions = {
  async fetchRecentMessages({ commit }) {
    const res = await this.$axios.get(process.env.API + '/activity')

    if (res.status === 200) {
      commit('setRecentMessages', res.data.recentmessages)
    }
  },

  clearRecentMessages({ commit }) {
    commit('clearRecentMessages')
  }
}
