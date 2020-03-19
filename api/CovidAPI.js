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

  async patch(params) {
    await this.$patch('/covid', params)
  }
}
