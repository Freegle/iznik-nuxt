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

export const state = () => ({
  // Use object not array otherwise we end up with a huge sparse array which hangs the browser when saving to local
  // storage.
  list: {}
})

export const mutations = {
  add(state, item) {
    item.earliestDate = earliestDate(item.dates)
    Vue.set(state.list, item.id, item)
  },

  addAll(state, items) {
    if (items) {
      items.forEach(item => {
        item.earliestDate = earliestDate(item.dates)
        Vue.set(state.list, item.id, item)
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
    delete state.list[params.id]
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

  list: state => {
    return state.list
  },

  sortedList: state => {
    const k = Object.values(state.list)
    return k.sort(function(a, b) {
      if (a.earliestDate && b.earliestDate) {
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
  async addFields({ dispatch }, items) {
    if (items) {
      for (let j = 0; j < items.length; j++) {
        for (let i = 0; i < items[j].dates.length; i++) {
          const date = items[j].dates[i]

          // Add human readable versions of each date range.
          const startm = new Moment(date.start)
          let endm = new Moment(date.end)
          endm = endm.isSame(startm, 'day')
            ? endm.format('HH:mm')
            : endm.format('ddd, Do MMM HH:mm')

          items[j].dates[i].string = {
            start: startm.format('ddd, Do MMM HH:mm'),
            end: endm,
            past: Date.now() > new Date(date.start)
          }

          if (!items[j].dates[i].uniqueid) {
            // Add a unique date id.  This is client-side only, used for keying component.
            items[j].dates[i].uniqueid = await dispatch(
              'uniqueid/generate',
              [],
              {
                root: true
              }
            )
          }
        }
      }
    }

    return items
  },

  async fetch({ commit, dispatch }, params) {
    const data = await this.$api.communityevent.fetch(params)
    if (params && params.id) {
      commit('addAll', await dispatch('addFields', [data.communityevent]))
    } else {
      commit('addAll', await dispatch('addFields', data.communityevents))

      commit('setContext', {
        ctx: data.context
      })
    }
  },
  clear({ commit }) {
    commit('setContext', {
      ctx: null
    })

    commit('setList', [])
  },
  async save({ commit, dispatch }, event) {
    await this.$api.communityevent.save(event)
    await dispatch('fetch', { id: event.id })
  },
  async delete({ commit, dispatch }, params) {
    await this.$api.del(params.id)
    commit('delete', { id: params.id })
  },
  async add({ commit, dispatch }, event) {
    const { id } = await this.$api.communityevent.create(event)
    await dispatch('fetch', { id })
    return id
  },
  async addGroup({ commit, dispatch }, { id, groupid }) {
    await this.$api.communityevent.addGroup(id, groupid)
    // Fetch back to update store and thereby components
    await dispatch('fetch', { id })
  },

  async removeGroup({ commit, dispatch }, { id, groupid }) {
    await this.$api.communityevent.removeGroup(id, groupid)
    // Fetch back to update store and thereby components
    await dispatch('fetch', { id })
  },

  async setPhoto({ commit, dispatch }, { id, photoid }) {
    await this.$api.communityevent.setPhoto(id, photoid)
    // Fetch back to update store and thereby components
    await dispatch('fetch', { id })
  },

  async setDates({ commit, dispatch }, params) {
    const promises = []

    for (const date of params.olddates) {
      promises.push(this.$api.communityevent.removeDate(params.id, date.id))
    }

    for (const date of params.newdates) {
      promises.push(
        this.$api.communityevent.addDate(params.id, date.start, date.end)
      )
    }

    await Promise.all(promises)
  }
}
