import BaseAPI from '@/api/BaseAPI'

export default class ShortlinksAPI extends BaseAPI {
  fetch(params) {
    return this.$get('/shortlink', params)
  }

  async add(data) {
    const { id } = await this.$post('/shortlink', data)
    return id
  }
}
