import Vue from 'vue'
import Moment from 'dayjs'

function earliestDate(dates) {
  // Find the earliest date which is in the future.
  const now = Date.now()
  let earliest = null
  let earliestDate = null

  for (let i = 0; i < dates.length; i++) {
    const atime = new Date(dates[i].start).getTime()
    if (atime >= now && (!earliest || atime < earliest)) {
      earliest = atime
      earliestDate = dates[i]
    }
  }

  return earliestDate
}

function addStrings(item) {
  // Add human readable versions of each date range.
  if (item) {
    for (let i = 0; i < item.dates.length; i++) {
      const date = item.dates[i]
      const startm = new Moment(date.start)
      let endm = new Moment(date.end)
      endm = endm.isSame(startm, 'day')
        ? endm.format('HH:mm')
        : endm.format('ddd, Do MMM HH:mm')

      item.dates[i].string = {
        start: startm.format('ddd, Do MMM HH:mm'),
        end: endm,
        past: Date.now() > new Date(date.start)
      }
    }
  }

  return item
}

export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  list: {}
})

export const mutations = {
  add(state, item) {
    item.earliestDate = earliestDate(item.dates)
    Vue.set(state.list, item.id, addStrings(item))
  },

  addAll(state, items) {
    if (items) {
      items.forEach(item => {
        item.earliestDate = earliestDate(item.dates)
        Vue.set(state.list, item.id, addStrings(item))
      })
    }
  },

  setList(state, list) {
    state.list = {}

    if (list) {
      for (const item of list) {
        item.earliestDate = earliestDate(item.dates)
        Vue.set(state.list, item.id, item)
      }
    }
  },

  setContext(state, params) {
    state.context = params.ctx
  },

  delete(state, params) {
    Vue.delete(state.list, params.id)
  }
}

export const getters = {
  get: state => id => {
    id = parseInt(id)
    return state.list[id] ? state.list[id] : null
  },

  list: state => {
    return state.list
  },

  sortedList: state => {
    const k = Object.values(state.list)
    return k.sort(function(a, b) {
      // Systemwide (i.e. without groups) come at the top.
      if (a.groups.length && !b.groups.length) {
        return -1
      } else if (!a.groups.length && b.groups.length) {
        return -1
      } else if (a.earliestDate && b.earliestDate) {
        return (
          new Date(a.earliestDate.start).getTime() -
          new Date(b.earliestDate.start).getTime()
        )
      } else {
        return a.id - b.id
      }
    })
  },

  getContext: state => {
    let ret = null

    if (state.context && state.context.end) {
      ret = state.context
    }

    return ret
  }
}

export const actions = {
  async fetch({ commit }, params) {
    if (!params) {
      params = {
        systemwide: true
      }
    } else if (!params.groupid) {
      // Not a specific group - get all of them including systemwide ones.
      params.systemwide = true
    }

    const {
      volunteering,
      volunteerings,
      context
    } = await this.$api.volunteering.fetch(params)
    if (params && params.id) {
      commit('addAll', [volunteering])
    } else {
      commit('addAll', volunteerings)
      commit('setContext', { ctx: context })
    }
  },
  clear({ commit }) {
    commit('setContext', {
      ctx: null
    })

    commit('setList', [])
  },
  async save({ commit, dispatch }, data) {
    await this.$api.volunteering.save(data)
    // Fetch back to update store and thereby components
    await dispatch('fetch', { id: data.id })
  },
  async add({ commit, dispatch }, data) {
    const id = await this.$api.volunteering.add(data)
    // Fetch back to update store and thereby components
    await dispatch('fetch', { id })
    return id
  },
  async delete({ commit, dispatch }, { id }) {
    await this.$api.volunteering.del(id)
    commit('delete', { id })
  },
  async addGroup({ commit, dispatch }, { id, groupid }) {
    await this.$api.volunteering.addGroup(id, groupid)
    // Fetch back to update store and thereby components
    await dispatch('fetch', { id })
  },

  async removeGroup({ commit, dispatch }, { id, groupid }) {
    await this.$api.volunteering.removeGroup(id, groupid)
    // Fetch back to update store and thereby components
    await dispatch('fetch', { id })
  },

  async setPhoto({ commit, dispatch }, { id, photoid }) {
    await this.$api.volunteering.setPhoto(id, photoid)
    // Fetch back to update store and thereby components
    await dispatch('fetch', { id })
  },

  async setDates({ commit, dispatch }, params) {
    const promises = []

    for (const date of params.olddates) {
      promises.push(this.$api.volunteering.removeDate(params.id, date.id))
    }

    for (const date of params.newdates) {
      promises.push(
        this.$api.volunteering.addDate(params.id, date.start, date.end)
      )
    }

    await Promise.all(promises)
  },

  async renew({ commit, dispatch }, { id }) {
    await this.$api.volunteering.renew(id)
    // Fetch back to update store and thereby components
    await dispatch('fetch', { id })
  },

  async expire({ commit, dispatch }, { id }) {
    await this.$api.volunteering.expire(id)
    // Fetch back to update store and thereby components
    await dispatch('fetch', { id })
  }
}
