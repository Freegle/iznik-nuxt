import merge from 'lodash.merge'
import assign from 'lodash.assign'

export const state = () => ({
  list: [],
  person: {}
})

export const mutations = {
  set(state, person) {
    state.list = person
  },
  add(state, value) {
    merge(state.list, value)
  },
  remove(state, { person }) {
    state.list.filter(c => person.id !== c.id)
  },
  mergePeople(state, form) {
    assign(state.person, form)
  },
  setPeople(state, form) {
    state.person = form
  }
}

export const actions = {
  async get({ commit }) {
    await this.$axios.get(process.env.API + '/people.json').then(res => {
      if (res.status === 200) {
        commit('set', res.data)
      }
    })
  },
  async show({ commit }, params) {
    await this.$axios.get(`/people/${params.person_id}`).then(res => {
      if (res.status === 200) {
        commit('mergePeople', res.data)
      }
    })
  },
  async set({ commit }, people) {
    await commit('set', people)
  },
  async form({ commit }, form) {
    await commit('mergePeople', form)
  },
  async add({ commit }, person) {
    await commit('add', person)
  },
  create({ commit }, params) {
    return this.$axios.post(`/people`, { person: params })
  },
  update({ commit }, params) {
    return this.$axios.put(`/people/${params.id}`, { person: params })
  },
  delete({ commit }, params) {
    return this.$axios.delete(`/people/${params.id}`)
  }
}
