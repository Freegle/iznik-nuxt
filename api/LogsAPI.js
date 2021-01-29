import BaseAPI from '@/api/BaseAPI'

export default class LogsAPI extends BaseAPI {
  fetch(params) {
    return this.$get('/logs', params)
  }
}
