import BaseAPI from '@/api/BaseAPI'

export default class ConfigAPI extends BaseAPI {
  fetch(params) {
    return this.$get('/config', params)
  }
}
