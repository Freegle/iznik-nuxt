import BaseAPI from '@/api/BaseAPI'

export default class JobAPI extends BaseAPI {
  async fetch(params) {
    const { data } = await this.$get('/adview.php', params)
    return data
  }
}
