import Vue from 'vue'
import dayjs from 'dayjs'

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
    const now = dayjs()

    if (list) {
      for (const item of list) {
        item.daysago = now.diff(dayjs(item.date), 'days')
        Vue.set(state.list, item.id, item)
      }
    }
  }
}

export const getters = {
  list: state => {
    return state.list
  }
}

export const actions = {
  async fetchList({ commit }, params) {
    commit('setList', await this.$api.usersearch.list(params))
  },

  async delete({ commit, getters, dispatch }, { id }) {
    await this.$api.usersearch.del(id)
    await dispatch('fetchList')
  }
}
