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
  get: state => id => {
    let ret = null

    Object.keys(state.list).forEach(key => {
      const chat = state.list[key]

      if (parseInt(key) === parseInt(id)) {
        ret = chat
      }
    })

    return ret
  },

  list: state => () => {
    return state.list
  }
}

export const actions = {
  popup({ commit }, params) {
    commit('popup', params)
  },

  hide({ commit }, params) {
    commit('hide', params)
  }
}
