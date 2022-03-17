import Vue from 'vue'

export const state = () => ({
  time: null
})

export const mutations = {
  set(state, params) {
    Vue.set(state, params.key, params.value)
  },

  setTime(state) {
    state.time = new Date()
  }
}

export const getters = {
  get: state => key => state[key],
  time: state => state.time
}

export const actions = {
  set({ commit }, params) {
    console.log('Misc set', params.key, params.value)
    commit('set', params)
  },

  setTime({ commit }) {
    commit('setTime')
  }
}
