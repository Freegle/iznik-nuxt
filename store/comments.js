import Vue from 'vue'

export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  list: {},
  context: null
})

export const mutations = {
  addAll(state, items) {
    if (items) {
      items.forEach(item => {
        Vue.set(state.list, item.id, item)
      })
    }
  },

  setList(state, list) {
    state.list = {}

    if (list) {
      for (const item of list) {
        Vue.set(state.list, item.id, item)
      }
    }
  },

  setContext(state, params) {
    console.log('Set context', params)
    state.context = params.ctx
  },

  delete(state, params) {
    Vue.delete(state.list, params.id)
  }
}

export const getters = {
  get: state => id => {
    id = parseInt(id)
    return state.list[id] ? state.list[id] : null
  },

  list: state => {
    return state.list
  },

  sortedList: state => {
    const k = Object.values(state.list)
    return k.sort(function(a, b) {
      return new Date(a.reviewed).getTime() - new Date(b.reviewed).getTime()
    })
  },

  getContext: state => {
    return state.context
  }
}

export const actions = {
  async fetch({ commit, dispatch }, params) {
    const data = await this.$api.comment.fetch(params)
    console.log('Returned', data)
    if (params && params.id) {
      commit('addAll', data.comment)
    } else {
      commit('addAll', data.comments)

      commit('setContext', {
        ctx: data.context
      })
    }
  },
  clear({ commit }) {
    commit('setContext', {
      ctx: null
    })

    commit('setList', [])
  }
}
