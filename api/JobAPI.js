import BaseAPI from '@/api/BaseAPI'

export default class JobAPI extends BaseAPI {
  async fetch(params) {
    // No need to log errors about this request - it often times out.
    const ret = await this.$get('/jobs', params, false)
    if (ret && ret.ret === 0 && ret.jobs) {
      return ret.jobs
    } else {
      throw new Error('Unexpected API data returned', ret)
    }
  }

  async log(params) {
    await this.$post('/jobs', params)
  }
}
