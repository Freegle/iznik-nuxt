import BaseAPI from '@/api/BaseAPI'

export default class AddressAPI extends BaseAPI {
  fetch(params) {
    return this.$get(params)
  }

  add(data) {
    return this.$put(data)
  }

  update(data) {
    return this.$patch(data)
  }

  del(id) {
    return this.$del({ id })
  }
}
