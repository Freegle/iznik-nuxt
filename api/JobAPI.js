import BaseAPI from '@/api/BaseAPI'

export default class JobAPI extends BaseAPI {
  async fetch(params) {
    // No need to log errors about this request - it often times out.
    const ret = await this.$get('/adview', params, false)
    if (ret && ret.ret === 0 && ret.adview && ret.adview.data) {
      return ret.adview.data
    } else {
      throw new Error('Unexpected API data returned', ret)
    }
  }

  async log(params) {
    await this.$post('/adview', params)
  }
}
