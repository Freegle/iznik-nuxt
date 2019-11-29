import BaseAPI from '@/api/BaseAPI'

export default class InvitationAPI extends BaseAPI {
  fetch(params) {
    return this.$get('/invitation', params)
  }

  async add(data) {
    const { id } = await this.$post('/invitation', data)
    return id
  }

  save(data) {
    return this.$patch('/invitation', data)
  }

  del(id) {
    return this.$del('/invitation', { id })
  }
}
