import BaseAPI from '@/api/BaseAPI'

export default class ShortlinkAPI extends BaseAPI {
  fetch(params) {
    return this.$get('/shortlink', params)
  }

  async add(data) {
    const { id } = await this.$post('/noticeboard', data)
    return id
  }
}
