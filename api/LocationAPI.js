import BaseAPI from '@/api/BaseAPI'

export default class LocationAPI extends BaseAPI {
  fetch(params) {
    return this.$get('/locations', params)
  }

  add(data) {
    return this.$put('/locations', data)
  }

  update(data) {
    return this.$patch('/locations', data)
  }

  del(id) {
    return this.$del('/locations', { id })
  }
}
