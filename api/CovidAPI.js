import BaseAPI from '@/api/BaseAPI'

export default class CovidAPI extends BaseAPI {
  record(type) {
    return this.$put('/covid', {
      helptype: type
    })
  }

  async fetch() {
    const ret = await this.$get('/covid')
    return ret.covids
  }
}
