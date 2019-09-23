import Vue from 'vue'

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

    if (list) {
      for (const item of list) {
        Vue.set(state.list, item.id, item)
      }
    }
  }
}

export const getters = {
  get: state => id => {
    let ret = null

    Object.keys(state.list).forEach(key => {
      const item = state.list[key]

      if (parseInt(key) === parseInt(id)) {
        ret = item
      }
    })

    return ret
  },

  list: state => () => {
    return state.list
  }
}

export const actions = {
  async fetchSummary({ commit }, params) {
    const res = await this.$axios.get(process.env.API + '/stories', {
      params: params
    })

    if (res.status === 200) {
      commit('setList', res.data.stories)
    }
  }
}
