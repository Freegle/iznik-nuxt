import Vue from 'vue'

export const state = () => ({
  cdn: process.env.CDN
})

export const mutations = {
  set(state, params) {
    Vue.set(state, params.key, params.value)
  }
}

export const getters = {
  get: state => key => state[key]
}

export const actions = {
  set({ commit }, params) {
    commit('set', params)
  }
}
