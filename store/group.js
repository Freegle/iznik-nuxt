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

  remove(state, item) {
    Vue.set(state.list, item.id, null)
  },

  setList(state, groups) {
    state.list = {}
    groups.forEach(function(group) {
      Vue.set(state.list, group.id, group)
    })
  },

  remember(state, payload) {
    Vue.set(state, 'remember-' + payload.id, payload.val)
  },

  forget(state, payload) {
    Vue.delete(state, 'remember-' + payload.id)
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

  list: state => {
    return state.list
  },

  remembered: state => id => {
    return state['remember-' + id]
  }
}

export const actions = {
  async list({ commit }, params) {
    commit('setList', await this.$api.group.list(params))
  },

  async fetch({ commit }, { id }) {
    commit('add', await this.$api.group.fetch(id))
  }
}
