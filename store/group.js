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
        if (parseInt(key) === parseInt(idOrName)) {
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

  async fetch({ commit }, { id, polygon }) {
    commit(
      'add',
      await this.$api.group.fetch(id, polygon, function(data) {
        if (data && data.ret === 2) {
          // Not hosting a group isn't worth logging.
          return false
        } else {
          return true
        }
      })
    )
  },

  async update({ dispatch }, params) {
    await this.$api.group.patch(params)
    await dispatch('fetch', {
      id: params.id,
      polygon: true
    })
  },

  async add({ commit }, params) {
    const id = await this.$api.group.add({
      grouptype: 'Freegle',
      action: 'Create',
      name: params.nameshort
    })

    this.$api.group.patch({
      id: id,
      namefull: params.namefull,
      publish: 0,
      polyofficial: params.cga,
      poly: params.dpa,
      lat: params.lat,
      lng: params.lng,
      onyahoo: 0,
      onhere: 1,
      licenserequired: 0,
      showonyahoo: 0
    })

    return id
  },

  async removeFacebook({ commit, dispatch }, params) {
    await this.$api.group.removeFacebook(params.groupid, params.uid)
    await dispatch('fetch', {
      id: params.groupid
    })
  }
}
