import BaseAPI from '@/api/BaseAPI'

export default class CovidAPI extends BaseAPI {
  record(type, info) {
    return this.$put('/covid', {
      helptype: type,
      info: info
    })
  }

  async fetch() {
    const ret = await this.$get('/covid')
    return ret.covids
  }

  async patch(params) {
    await this.$patch('/covid', params)
  }
}
