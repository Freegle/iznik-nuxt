import BaseAPI from '@/api/BaseAPI'

export default class MicroVolunteeringAPI extends BaseAPI {
  async challenge(params) {
    const ret = await this.$get('/microvolunteering', params)
    return ret.microvolunteering
  }

  response(params) {
    return this.$post('/microvolunteering', params)
  }

  async list(context, groupid) {
    const ret = await this.$get('/microvolunteering', {
      list: true,
      context,
      groupid
    })

    return ret
  }
}
