import BaseAPI from '@/api/BaseAPI'

export default class ActivityAPI extends BaseAPI {
  fetch() {
    return this.$get('/activity')
  }
}
