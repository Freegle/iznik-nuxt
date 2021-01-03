import BaseAPI from '@/api/BaseAPI'

export default class TrystAPI extends BaseAPI {
  async add(data) {
    const { id } = await this.$put('/tryst', data)
    return id
  }

  edit(data) {
    return this.$patch('/tryst', data)
  }

  fetch(params) {
    return this.$get('/tryst', params)
  }

  confirm(id) {
    return this.$post('/tryst', {
      id,
      confirm: true
    })
  }

  decline(id) {
    return this.$post('/tryst', {
      id,
      decline: true
    })
  }

  delete(data) {
    return this.$del('/tryst', data)
  }
}
