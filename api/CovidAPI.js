import BaseAPI from '@/api/BaseAPI'

export default class CovidAPI extends BaseAPI {
  record(type, info) {
    return this.$put('/covid', {
      helptype: type,
      info: info
    })
  }

  async fetch(groupid) {
    const ret = await this.$get('/covid', {
      groupid
    })
    return ret.covids
  }

  async fetchOne(id) {
    const ret = await this.$get('/covid', {
      id
    })
    return ret.covid
  }

  async patch(params) {
    await this.$patch('/covid', params)
  }

  async suggest(helper, helpee) {
    await this.$post('/covid', {
      helper,
      helpee,
      action: 'Suggest'
    })
  }

  async remove(helper, helpee) {
    await this.$post('/covid', {
      helper,
      helpee,
      action: 'Remove'
    })
  }

  async dispatch(helpee) {
    await this.$post('/covid', {
      helpee,
      action: 'Dispatch'
    })
  }
}
