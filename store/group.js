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
  }
}

export const getters = {
  get: state => idOrName => {
    if (!isNaN(idOrName)) {
      // Numeric - find by id
      return state.list.includes(idOrName) ? state.list[idOrName] : null
    } else {
      // Not - scan for match
      const lower = idOrName.toLowerCase()
      let ret = null

      Object.keys(state.list).forEach(key => {
        const group = state.list[key]
        if (group) {
          if (group.nameshort.toLowerCase() === lower) {
            ret = group
          }
        }
      })

      return ret
    }
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
  }
}
