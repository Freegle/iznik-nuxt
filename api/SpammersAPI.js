import BaseAPI from '@/api/BaseAPI'

export default class SpammersAPI extends BaseAPI {
  async fetch(params) {
    const { spammers, context } = await this.$get('/spammers', params)
    return { spammers, context }
  }

  add(params) {
    return this.$post('/spammers', params)
  }

  patch(params) {
    return this.$patch('/spammers', params)
  }

  del(params) {
    return this.$del('/spammers', params)
  }
}
