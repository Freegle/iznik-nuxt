import BaseAPI from '@/api/BaseAPI'

export default class MicroVolunteeringAPI extends BaseAPI {
  async challenge() {
    const ret = await this.$get('/microvolunteering')
    return ret.microvolunteering
  }

  response({ msgid, response, comments }) {
    return this.$post('/microvolunteering', { msgid, response, comments })
  }
}
