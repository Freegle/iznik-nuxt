import BaseAPI from '@/api/BaseAPI'

export default class AlertAPI extends BaseAPI {
  fetch(params) {
    return this.$get('/alert', params)
  }

  add(data) {
    return this.$put('/alert', data)
  }

  record(data) {
    return this.$post('/alert', data)
  }
}
