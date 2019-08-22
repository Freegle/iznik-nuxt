export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  list: [],
  context: null
})

export const mutations = {
  add(state, notifications) {
    console.log('Set', notifications)
    if (notifications) {
      state.list = [...state.list, ...notifications]
    }
  },

  setContext(state, params) {
    state.context = params.ctx
  },

  setList(state, list) {
    state.list = list
  }
}

export const getters = {
  list: state => () => {
    return state.list
  },

  getContext: state => () => {
    return state.context
  }
}

export const actions = {
  async list({ commit, state }, params) {
    const res = await this.$axios.get(process.env.API + '/notification', {
      params: {
        context: state.context
      }
    })

    if (res.status === 200) {
      commit('add', res.data.notifications)

      commit('setContext', {
        ctx: res.data.context ? res.data.context : null
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
