import merge from 'lodash.merge'
import assign from 'lodash.assign'

export const state = () => ({
  list: [],
  location: {}
})

export const mutations = {
  set(state, location) {
    state.list = location
  },
  add(state, value) {
    merge(state.list, value)
  },
  remove(state, { location }) {
    state.list.filter(c => location.id !== c.id)
  },
  mergeLocations(state, form) {
    assign(state.location, form)
  },
  setLocations(state, form) {
    state.location = form
  }
}

export const actions = {
  async get({ commit }) {
    await this.$axios.get(process.env.API + '/locations.json').then(res => {
      if (res.status === 200) {
        commit('set', res.data)
      }
    })
  },
  async show({ commit }, params) {
    await this.$axios.get(`/locations/${params.location_id}`).then(res => {
      if (res.status === 200) {
        commit('mergeLocations', res.data)
      }
    })
  },
  async set({ commit }, locations) {
    await commit('set', locations)
  },
  async form({ commit }, form) {
    await commit('mergeLocations', form)
  },
  async add({ commit }, location) {
    await commit('add', location)
  },
  create({ commit }, params) {
    return this.$axios.post(`/locations`, { location: params })
  },
  update({ commit }, params) {
    return this.$axios.put(`/locations/${params.id}`, { location: params })
  },
  delete({ commit }, params) {
    return this.$axios.delete(`/locations/${params.id}`)
  }
}
