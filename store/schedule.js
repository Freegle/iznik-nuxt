import Vue from 'vue'

export const state = () => ({
  schedule: {}
})

export const mutations = {
  set(state, schedule) {
    Vue.set(state.schedule, schedule.userid, schedule)
    console.log('Set schedule', schedule.userid, state)
  }
}

export const getters = {
  get: state => userid => {
    return state.schedule[userid]
  }
}

export const actions = {
  async fetch({ commit }, params) {
    commit('set', await this.$api.schedule.fetch(params))
  },

  async update({ commit, dispatch }, params) {
    await this.$api.schedule.update(params)
    await dispatch('fetch', { userid: params.userid })
  }
}
