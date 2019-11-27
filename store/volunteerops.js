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
    items.forEach(item => {
      item.earliestDate = earliestDate(item.dates)
      Vue.set(state.list, item.id, addStrings(item))
    })
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

  remove(state, params) {
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

    const res = await this.$axios.get(process.env.API + '/volunteering', {
      params: params
    })

    if (res.status === 200) {
      if (params && params.id) {
        commit('addAll', [res.data.volunteering])
      } else {
        commit('addAll', res.data.volunteerings)

        commit('setContext', {
          ctx: res.data.context
        })
      }
    }
  },
  clear({ commit }) {
    commit('setContext', {
      ctx: null
    })

    commit('setList', [])
  },
  async save({ commit, dispatch }, event) {
    const ret = await this.$axios.post(
      process.env.API + '/volunteering',
      event,
      {
        headers: {
          'X-HTTP-Method-Override': 'PATCH'
        }
      }
    )

    if (ret.status === 200 && ret.data.ret === 0) {
      // Fetch back to update store and thereby components
      await dispatch('fetch', {
        id: event.id
      })
    }

    return ret
  },
  async add({ commit, dispatch }, event) {
    const ret = await this.$axios.post(
      process.env.API + '/volunteering',
      event,
      {
        headers: {
          'X-HTTP-Method-Override': 'POST'
        }
      }
    )

    if (ret.status === 200 && ret.data.ret === 0) {
      // Fetch back to update store and thereby components
      await dispatch('fetch', {
        id: ret.data.id
      })
    }

    return ret.data.id
  },
  async delete({ commit, dispatch }, params) {
    const ret = await this.$axios.post(
      process.env.API + '/volunteering',
      {
        id: params.id
      },
      {
        headers: {
          'X-HTTP-Method-Override': 'DELETE'
        }
      }
    )

    if (ret.status === 200 && ret.data.ret === 0) {
      commit('delete', {
        id: params.id
      })
    }

    return ret
  },
  async addGroup({ commit, dispatch }, params) {
    const ret = await this.$axios.post(
      process.env.API + '/volunteering',
      {
        id: params.id,
        action: 'AddGroup',
        groupid: params.groupid
      },
      {
        headers: {
          'X-HTTP-Method-Override': 'PATCH'
        }
      }
    )

    if (ret.status === 200 && ret.data.ret === 0) {
      // Fetch back to update store and thereby components
      await dispatch('fetch', {
        id: params.id
      })
    }

    return ret
  },

  async removeGroup({ commit, dispatch }, params) {
    const ret = await this.$axios.post(
      process.env.API + '/volunteering',
      {
        id: params.id,
        action: 'RemoveGroup',
        groupid: params.groupid
      },
      {
        headers: {
          'X-HTTP-Method-Override': 'PATCH'
        }
      }
    )

    if (ret.status === 200 && ret.data.ret === 0) {
      // Fetch back to update store and thereby components
      await dispatch('fetch', {
        id: params.id
      })
    }

    return ret
  },

  async setPhoto({ commit, dispatch }, params) {
    const ret = await this.$axios.post(
      process.env.API + '/volunteering',
      {
        id: params.id,
        action: 'SetPhoto',
        photoid: params.photoid
      },
      {
        headers: {
          'X-HTTP-Method-Override': 'PATCH'
        }
      }
    )

    if (ret.status === 200 && ret.data.ret === 0) {
      // Fetch back to update store and thereby components
      await dispatch('fetch', {
        id: params.id
      })
    }

    return ret
  },

  async setDates({ commit, dispatch }, params) {
    const promises = []

    for (const date of params.olddates) {
      promises.push(
        this.$axios.post(
          process.env.API + '/volunteering',
          {
            id: params.id,
            action: 'RemoveDate',
            dateid: date.id
          },
          {
            headers: {
              'X-HTTP-Method-Override': 'PATCH'
            }
          }
        )
      )
    }

    for (const date of params.newdates) {
      promises.push(
        this.$axios.post(
          process.env.API + '/volunteering',
          {
            id: params.id,
            action: 'AddDate',
            start: date.start,
            end: date.end
          },
          {
            headers: {
              'X-HTTP-Method-Override': 'PATCH'
            }
          }
        )
      )
    }

    await Promise.all(promises)
  }
}
