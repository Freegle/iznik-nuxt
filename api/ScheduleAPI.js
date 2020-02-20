import BaseAPI from '@/api/BaseAPI'

export default class ScheduleAPI extends BaseAPI {
  async fetch(params) {
    const { schedule } = await this.$get('/schedule', params)
    return schedule
  }

  update(params) {
    return this.$post('/schedule', params)
  }
}
