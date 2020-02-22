import BaseAPI from '@/api/BaseAPI'

export default class StatusAPI extends BaseAPI {
  fetch(params) {
    return this.$get('/status', params)
  }
}
