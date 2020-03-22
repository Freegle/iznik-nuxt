import Vue from 'vue'

export const state = () => ({
  list: [],
  context: null,
  params: null
})

export const mutations = {
  add(state, items) {
    if (items) {
      state.list.push(...items)
    }
  },

  clear(state) {
    state.list = []
    state.context = null
  },

  setContext(state, params) {
    state.context = params.ctx
  },

  delete(state, params) {
    Vue.delete(state.list, params.id)
  },

  setParams(state, val) {
    console.log('Set params', val)
    state.params = val
  }
}

export const getters = {
  list: state => state.list,
  params: state => state.params
}

export const actions = {
  async fetch({ state, commit, dispatch }, params) {
    params.context = state.context
    const data = await this.$api.logs.fetch(params)

    if (params && params.id) {
      commit('add', [data.log])
    } else {
      commit('add', data.logs)

      commit('setContext', {
        ctx: data.context
      })
    }
  },
  clear({ commit }) {
    commit('clear')
  },
  setParams({ commit }, val) {
    commit('setParams', val)
  }
}
