export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  list: {}
})

export const mutations = {
  add(state, item) {
    state.list[item.id] = item
  },

  remove(state, item) {
    state.list[item.id] = null
  },

  setList(state, groups) {
    state.list = {}
    for (const group of groups) {
      state.list[group.id] = group
    }
  },

  remember(state, payload) {
    state['remember-' + payload.id] = payload.val
  }
}

export const getters = {
  get: state => idOrName => {
    let ret = null

    if (!isNaN(idOrName)) {
      // Numeric - find by id
      Object.keys(state.list).forEach(key => {
        const group = state.list[key]
        if (parseInt(key) === idOrName) {
          ret = group
        }
      })
    } else {
      // Not - scan for match
      const lower = idOrName.toLowerCase()

      Object.keys(state.list).forEach(key => {
        const group = state.list[key]
        if (group) {
          if (group.nameshort.toLowerCase() === lower) {
            ret = group
          }
        }
      })
    }

    return ret
  },

  list: state => () => {
    return state.list
  },

  remembered: state => id => {
    return state['remember-' + id]
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const res = await this.$axios.get(process.env.API + '/group', {
      params: {
        id: params.id
      }
    })

    if (res.status === 200) {
      commit('add', res.data.group)
    }
  },

  async mine({ commit }, params) {
    const res = await this.$axios.get(process.env.API + '/session', {
      params: {
        components: ['groups']
      }
    })

    if (res.status === 200 && res.data.ret === 0 && res.data.groups) {
      for (const group of res.data.groups) {
        if (process.env.MODTOOLS || group.type === 'Freegle') {
          commit('add', group)
        }
      }
    }
  }
}
