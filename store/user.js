import Vue from 'vue'

export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  list: {}
})

function getUserByID(state, id) {
  if (!state || !state.list || !(id in state.list)) {
    return null
  }

  return state.list[id]
}

export const mutations = {
  add(state, item) {
    Vue.set(state.list, item.id, item)
  },

  setList(state, items) {
    state.list = {}
    for (const item of items) {
      Vue.set(state.list, item.id, item)
    }
  },
  remove(state, item) {
    state.list = state.list.filter(obj => {
      if (parseInt(item.id) && parseInt(item.id) === parseInt(obj.id)) {
        return false
      } else {
        return true
      }
    })
  }
}

export const getters = {
  get: state => id => {
    return getUserByID(state, id)
  },

  list: state => {
    return state.list
  },

  userHasReneged: state => id => {
    const user = getUserByID(state, id)

    // If the user can't be found then return false
    return user && user.info
      ? user.info.reneged &&
          user.info.reneged > 1 &&
          (user.info.reneged * 100) /
            (user.info.reneged + user.info.collected) >
            25
      : false
  }
}

export const actions = {
  async fetch({ commit }, params) {
    commit('add', await this.$api.user.fetch(params))
  },

  async rate({ commit, dispatch }, { id, rating }) {
    await this.$api.user.rate(id, rating)

    // Fetch the user back into the store to update any ratings elsewhere
    await dispatch('fetch', { id, info: true })
  },

  async edit({ commit, dispatch }, params) {
    await this.$api.user.save(params)
  },

  async purge({ commit, dispatch }, params) {
    await this.$api.user.purge(params)

    commit('remove', {
      id: params.id
    })
  }
}
