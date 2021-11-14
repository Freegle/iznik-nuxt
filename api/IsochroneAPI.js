import BaseAPI from '@/api/BaseAPI'

export default class ActivityAPI extends BaseAPI {
  add(params) {
    return this.$put('/isochrone', params)
  }

  fetch() {
    return this.$get('/isochrone')
  }

  patch(params) {
    return this.$patch('/isochrone', params)
  }

  del(id) {
    return this.$del('/isochrone', { id })
  }
}
