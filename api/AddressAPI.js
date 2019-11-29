import BaseAPI from '@/api/BaseAPI'

export default class AddressAPI extends BaseAPI {
  fetch(params) {
    return this.$get('/address', params)
  }

  add(data) {
    return this.$put('/address', data)
  }

  update(data) {
    return this.$patch('/address', data)
  }

  del(id) {
    return this.$del('/address', { id })
  }
}
