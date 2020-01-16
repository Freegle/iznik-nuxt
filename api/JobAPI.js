import BaseAPI from '@/api/BaseAPI'

export default class JobAPI extends BaseAPI {
  async fetch(params) {
    const ret = await this.$get('/jobview', params)
    if (ret.ret === 0 && ret.adview && ret.adview.data) {
      return ret.adview.data
    } else {
      throw new Error('Unexpected API data returned', ret)
    }
  }
}
