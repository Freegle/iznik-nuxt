import BaseAPI from '@/api/BaseAPI'

export default class NoticeboardAPI extends BaseAPI {
  fetch(params) {
    return this.$get('/noticeboard', params)
  }

  async add(data) {
    const { id } = await this.$post('/noticeboard', data)
    return id
  }

  save(data) {
    return this.$patch('/noticeboard', data)
  }

  action(data) {
    return this.$post('/noticeboard', data)
  }

  del(id) {
    return this.$del('/noticeboard', { id })
  }
}
