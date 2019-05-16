import qs from 'qs'

export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  route: [],
  sponsors: [],
  nights: [],
  total: 0
})

export const mutations = {
  add(state, payload) {
    state.route = payload.route
    state.sponsors = payload.sponsors
    state.total = payload.total
    state.nights = []

    for (const night of payload.nights) {
      state.nights.push({
        id: night.id,
        position: {
          lat: night.lat,
          lng: night.lng
        },
        name: night.name,
        date: night.date
      })
    }
  }
}

export const getters = {
  route: state => {
    return state.route
  },
  sponsors: state => {
    return state.sponsors
  },
  nights: state => {
    return state.nights
  },
  total: state => {
    return state.total
  }
}

export const actions = {
  async fetch({ commit }, params) {
    const res = await this.$axios.get('https://iznik.modtools.org/api/stroll')

    if (res.status === 200 && res.data.ret === 0) {
      commit('add', {
        route: res.data.route,
        sponsors: res.data.sponsors,
        nights: res.data.nights,
        total: res.data.total
      })
    }
  },

  async sponsor({ commit }, params) {
    await this.$axios.post(
      'https://iznik.modtools.org/api/stroll',
      qs.stringify({
        sponsorname: params.sponsorName
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  }
}
