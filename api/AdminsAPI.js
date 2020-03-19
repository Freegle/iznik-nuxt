import BaseAPI from '@/api/BaseAPI'

export default class AdminsAPI extends BaseAPI {
  fetch(params) {
    return this.$get('/admin', params)
  }

  async add(data) {
    const { id } = await this.$post('/admin', data)
    return id
  }

  async patch(data) {
    await this.$patch('/admin', data)
  }

  async del(data) {
    await this.$del('/admin', data)
  }
}
