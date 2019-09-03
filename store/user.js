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

  setList(state, items) {
    state.list = {}
    for (const item of items) {
      Vue.set(state.list, item.id, item)
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
  async fetch({ commit }, params) {
    const rsp = await this.$axios.get(process.env.API + '/user', {
      params: params
    })

    if (rsp.status === 200 && rsp.data.ret === 0) {
      commit('add', rsp.data.user)
    }
  },

  async rate({ commit, dispatch }, params) {
    await this.$axios.post(process.env.API + '/user', {
      action: 'Rate',
      ratee: params.id,
      rating: params.rating
    })

    // Fetch the user back into the store to update any ratings elsewhere
    await dispatch('fetch', {
      id: params.id,
      info: true
    })

    console.log('Fetched')
  }
}
