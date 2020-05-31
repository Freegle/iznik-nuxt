import Vue from 'vue'

export const state = () => ({
  list: {},
  remember: {}
})

export const mutations = {
  popup(state, params) {
    Vue.set(state.list, params.id, params)
  },

  hide(state, params) {
    Vue.delete(state.list, parseInt(params.id))
  }
}

export const getters = {
  list: state => {
    return state.list
  }
}

export const actions = {
  popup({ dispatch, commit }, params) {
    commit('popup', params)
  },

  hide({ commit }, params) {
    commit('hide', params)
  }
}
