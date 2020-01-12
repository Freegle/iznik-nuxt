import BaseAPI from '@/api/BaseAPI'

export default class JobAPI extends BaseAPI {
  fetch(params) {
    return this.$get('/adview', params)
  }
}
