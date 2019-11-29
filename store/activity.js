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
  listRecentMessages: state => {
    return Object.values(state.recentmessages)
  }
}

export const actions = {
  async fetchRecentMessages({ commit }) {
    commit('setRecentMessages', await this.$api.activity.fetch())
  },

  clearRecentMessages({ commit }) {
    commit('clearRecentMessages')
  }
}
