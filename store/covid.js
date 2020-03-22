import Vue from 'vue'

export const state = () => ({
  list: {},
  counts: {}
})

export const mutations = {
  setCounts(state, counts) {
    state.counts = counts
  },

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

  clear(state, id) {
    Vue.delete(state.list, id)
  }
}

export const getters = {
  counts: state => state.counts,

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

  getByUserId: state => id => {
    let ret = null

    Object.keys(state.list).forEach(key => {
      const item = state.list[key]

      if (parseInt(item.userid) === parseInt(id)) {
        ret = item
      }
    })

    return ret
  },

  list: state => {
    return state.list
  }
}

export const actions = {
  async counts({ commit }, params) {
    const ret = await this.$api.covid.counts({
      groupid: params.groupid,
      counts: true
    })

    commit('setCounts', ret)
  },

  async fetch({ commit }, params) {
    const covid = await this.$api.covid.fetchOne(params)
    commit('add', covid)
  },

  async fetchGroup({ commit }, params) {
    const covids = await this.$api.covid.fetchGroup(params)
    commit('setList', Object.values(covids))
  },

  clear({ commit }) {
    commit('setState', {})
  },

  async add({ commit, dispatch }, params) {
    const id = await this.$api.covid.add(params)

    await dispatch('fetch', {
      id: id
    })

    return id
  },

  async record({ commit, dispatch }, params) {
    await this.$api.covid.record(params.type, params.info)
  },

  async edit({ commit, dispatch }, params) {
    await this.$api.covid.patch(params)

    await dispatch('fetch', {
      id: params.id
    })
  },

  async suggest({ commit, dispatch }, params) {
    await this.$api.covid.suggest(params)

    await dispatch('fetch', {
      userid: params.helpee
    })
  },

  async remove({ commit, dispatch }, params) {
    await this.$api.covid.remove(params)

    await dispatch('fetch', {
      userid: params.helpee
    })
  },

  async hold({ commit, dispatch }, params) {
    await this.$api.covid.hold(params)

    await dispatch('fetch', {
      id: params.id
    })
  },

  async release({ commit, dispatch }, params) {
    await this.$api.covid.release(params)

    await dispatch('fetch', {
      id: params.id
    })
  },

  async dispatch({ commit, dispatch }, params) {
    await this.$api.covid.dispatch(params)

    await dispatch('fetch', {
      id: params.id
    })
  }
}
