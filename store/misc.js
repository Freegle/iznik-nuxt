import Vue from 'vue'

export const state = () => ({})

export const mutations = {
  set(state, params) {
    Vue.set(state, params.key, params.value)
    console.log('Set', params.key, params.value, state)
  }
}

export const getters = {
  get: state => key => state[key]
}

export const actions = {
  set({ commit }, params) {
    console.log('Set with', params)
    commit('set', params)
  }
}
