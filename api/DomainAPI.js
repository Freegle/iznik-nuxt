import BaseAPI from '@/api/BaseAPI'

export default class AddressAPI extends BaseAPI {
  fetch(params) {
    return this.$get('/domains', params)
  }
}
