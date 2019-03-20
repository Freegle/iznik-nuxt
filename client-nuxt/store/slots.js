import merge from 'lodash.merge'
import assign from 'lodash.assign'
// import { mapGetters } from 'vuex'

export const state = () => ({
  list: [],
  slot: {}
})

export const mutations = {
  set(state, slot) {
    state.list = slot
  },
  add(state, value) {
    merge(state.list, value)
  },
  remove(state, { slot }) {
    state.list.filter(c => slot.id !== c.id)
  },
  mergeSlots(state, form) {
    assign(state.slot, form)
  },
  setSlots(state, form) {
    state.slot = form
  }
}

export const actions = {
  async get({ commit }) {
    await this.$axios.get(process.env.API + `/slots`).then(res => {
      if (res.status === 200) {
        commit('set', res.data)
      }
    })
  },
  async show({ commit }, params) {
    await this.$axios
      .get(process.env.API + `/slots/${params.slot_id}`)
      .then(res => {
        if (res.status === 200) {
          commit('mergeSlots', res.data)
        }
      })
  },
  async set({ commit }, slots) {
    await commit('set', slots)
  },
  async form({ commit }, form) {
    await commit('mergeSlots', form)
  },
  async add({ commit }, slot) {
    await commit('add', slot)
  },
  create({ commit }, params) {
    // We need to post in ld+json in order to use the relationship info correctly.
    return this.$axios({
      method: 'POST',
      url: process.env.API + `/slots`,
      data: params,
      headers: {
        'Content-Type': 'application/ld+json'
      }
    })
  },
  update({ commit }, params) {
    return this.$axios.put(process.env.API + `/slots/${params.id}`, {
      slot: params
    })
  },
  delete({ commit }, params) {
    return this.$axios.delete(process.env.API + `/slots/${params.id}`)
  }
}

export const gettters = {
  // computed: {
  //   ...mapGetters(['grid'])
  // },
  grid: state => {
    console.log('Grid state', state)
  }
}
