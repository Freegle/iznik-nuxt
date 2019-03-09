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

        if (process.client) {
          // Subscribe for Mercure updates.
          // Extract the hub URL from the Link header
          const hubUrl = res.headers.link.match(
            /<([^>]+)>;\s+rel=(?:mercure|"[^"]*mercure[^"]*")/
          )[1]

          console.log('Got hub', hubUrl)
          // Append the topic(s) to subscribe as query parameter
          const h = new URL(hubUrl)
          // h.searchParams.append('topic', '/locations/{id}')
          h.searchParams.append('topic', 'http://{domain}/{+anything}')

          // Subscribe to updates
          const es = new EventSource(h.toString())
          es.onerror = e => console.error('Event error', e)
          es.onmessage = e => console.log(e.data)
        }
      }
    })
  },
  async show({ commit }, params) {
    await this.$axios
      .get(process.env.API + `/locations/${params.location_id}`)
      .then(res => {
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
    return this.$axios.post(process.env.API + `/locations`, params)
  },
  update({ commit }, params) {
    return this.$axios.put(process.env.API + `/locations/${params.id}`, params)
  },
  delete({ commit }, params) {
    return this.$axios.delete(process.env.API + `/locations/${params.id}`)
  }
}
