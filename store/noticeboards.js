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
    const res = await this.$axios.get(process.env.API + '/noticeboard', {
      params: params
    })

    if (res.status === 200) {
      commit(
        'setList',
        res.data.noticeboard ? [res.data.noticeboard] : res.data.noticeboards
      )
    }
  },

  async delete({ commit, getters, dispatch }, params) {
    await this.$axios.post(
      process.env.API + '/noticeboard',
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
    const ret = await this.$axios.post(process.env.API + '/noticeboard', params)

    if (ret.status === 200 && ret.data.id) {
      await dispatch('fetch', {
        id: ret.data.id
      })

      id = ret.data.id
    }

    console.log('ADded', id, ret)
    return id
  },

  async edit({ commit, getters, dispatch }, params) {
    await this.$axios.post(process.env.API + '/noticeboard', params, {
      headers: {
        'X-HTTP-Method-Override': 'PATCH'
      }
    })

    await dispatch('fetch', {
      id: params.id
    })
  }
}
