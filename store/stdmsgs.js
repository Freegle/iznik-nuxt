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

  async update({ state, dispatch }, params) {
    await this.$api.modconfigs.patchStdMsg(params)
    await dispatch(
      'modconfigs',
      {
        id: params.configid,
        configuring: true
      },
      {
        root: true
      }
    )
  }
}
