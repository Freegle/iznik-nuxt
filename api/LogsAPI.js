import BaseAPI from '@/api/BaseAPI'

export default class LogAPI extends BaseAPI {
  fetch(params) {
    return this.$get('/logs', params)
  }
}
