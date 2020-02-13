import BaseAPI from '@/api/BaseAPI'

export default class UserAPI extends BaseAPI {
  async fetch(params) {
    const { user } = await this.$get('/user', params)
    return user
  }

  rate(id, rating) {
    return this.$post('/user', { ratee: id, rating, action: 'Rate' })
  }

  unbounce(id) {
    return this.$post('/user', { id: id, action: 'Unbounce' })
  }

  save(event) {
    return this.$patch('/user', event)
  }
}
