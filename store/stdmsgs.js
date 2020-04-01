export const state = () => ({
  stdmsgs: []
})

export const mutations = {
  set(state, stdmsg) {
    state.stdmsgs[stdmsg.id] = stdmsg
  }
}

export const getters = {
  stdmsgs: state => {
    return state.stdmsgs
  },

  byid: state => id => {
    return state.stdmsgs.find(msg => {
      return msg.id === id
    })
  }
}

export const actions = {
  async fetch({ state, commit }, params) {
    const { stdmsg } = await this.$api.modconfigs.fetchStdMsg(params.id)
    commit('set', stdmsg)
    return stdmsg
  },

  async delete({ state, commit, dispatch }, params) {
    await this.$api.modconfigs.deleteStdMsg(params)

    await dispatch(
      'modconfigs/fetchConfig',
      {
        id: params.configid,
        configuring: true
      },
      {
        root: true
      }
    )
  },

  async update({ state, dispatch }, params) {
    await this.$api.modconfigs.patchStdMsg(params)
    await dispatch(
      'modconfigs/fetchConfig',
      {
        id: params.configid,
        configuring: true
      },
      {
        root: true
      }
    )
  },

  async add({ commit, getters, dispatch }, params) {
    const { id } = await this.$api.modconfigs.addStdMsg(params)
    await dispatch(
      'modconfigs/fetchConfig',
      {
        id: params.configid,
        configuring: true
      },
      {
        root: true
      }
    )
    return id
  }
}
