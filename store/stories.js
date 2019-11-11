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
  },

  clear(state) {
    state.list = {}
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
    const res = await this.$axios.get(process.env.API + '/stories', {
      params: params
    })

    if (res.status === 200) {
      if (params.id) {
        commit('add', res.data.story)
      } else {
        commit('setList', res.data.stories)
      }
    }
  },

  clear({ commit }) {
    commit('clear')
  },

  async add({ commit }, params) {
    const res = await this.$axios.post(process.env.API + '/stories', params, {
      headers: {
        'X-HTTP-Method-Override': 'PUT'
      }
    })

    let id = null

    if (res.status === 200 && res.data.ret === 0) {
      id = res.data.id
    }

    return id
  },

  async love({ commit, dispatch }, params) {
    await this.$axios.post(process.env.API + '/stories', {
      id: params.id,
      action: 'Like'
    })

    await dispatch('fetch', params)
  },

  async unlove({ commit, dispatch }, params) {
    await this.$axios.post(process.env.API + '/stories', {
      id: params.id,
      action: 'Unlike'
    })

    await dispatch('fetch', params)
  }
}
