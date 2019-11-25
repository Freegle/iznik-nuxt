import Vue from 'vue'

export const state = () => ({
  list: {},
  properties: {},
  selected: null
})

export const mutations = {
  set(state, list) {
    if (list) {
      for (const item of list) {
        Vue.set(state.list, item.id, item)
      }
    }
  },

  setProperties(state, list) {
    if (list) {
      for (const item of list) {
        Vue.set(state.properties, item.id, item)
      }
    }
  },

  select(state, id) {
    state.selected = id
  },

  clear(state) {
    state.list = {}
  },

  clearProperties(state) {
    state.properties = {}
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

  list: state => {
    return state.list
  },

  properties: state => {
    return state.properties
  },

  selected: state => {
    const addresses = Object.values(state.list)

    if (state.selected) {
      // We have remembered a preferred address.
      return state.selected
    } else if (addresses.length) {
      // Just return one of them.
      return addresses[0].id
    } else {
      return null
    }
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const res = await this.$axios.get(process.env.API + '/address', {
      params: params
    })

    if (res.status === 200 && res.data.ret === 0) {
      if (res.data.addresses) {
        commit('clear')
        commit('set', res.data.addresses)
      } else {
        commit('set', [res.data.address])
      }
    }
  },

  async fetchProperties({ commit }, params) {
    const res = await this.$axios.get(process.env.API + '/address', {
      params: params
    })

    if (res.status === 200 && res.data.ret === 0) {
      commit('clearProperties')
      commit('setProperties', res.data.addresses)
      console.log('Set properties', res.data.addresses)
    }
  },

  async delete({ commit, getters, dispatch }, params) {
    await this.$axios.post(
      process.env.API + '/address',
      {
        id: params.id
      },
      {
        headers: {
          'X-HTTP-Method-Override': 'DELETE'
        }
      }
    )

    await dispatch('fetch')
  },

  async add({ commit, getters, dispatch }, params) {
    let id = null
    const ret = await this.$axios.post(process.env.API + '/address', params, {
      headers: {
        'X-HTTP-Method-Override': 'PUT'
      }
    })

    if (ret.status === 200 && ret.data.ret === 0) {
      await dispatch('fetch', {
        id: ret.data.id
      })

      id = ret.data.id
    }

    return id
  },

  async update({ commit, getters, dispatch }, params) {
    await this.$axios.post(process.env.API + '/address', params, {
      headers: {
        'X-HTTP-Method-Override': 'PATCH'
      }
    })

    await dispatch('fetch', {
      id: params.id
    })
  },

  select({ commit }, id) {
    commit('select', id)
  }
}
