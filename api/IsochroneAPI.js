import BaseAPI from '@/api/BaseAPI'

export default class IsochroneAPI extends BaseAPI {
  add(params) {
    return this.$put('/isochrone', params)
  }

  fetch(params) {
    return this.$get('/isochrone', params)
  }

  patch(params) {
    return this.$patch('/isochrone', params)
  }

  del(id) {
    return this.$del('/isochrone', { id })
  }
}
