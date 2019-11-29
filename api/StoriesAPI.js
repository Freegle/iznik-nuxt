import BaseAPI from '@/api/BaseAPI'

export default class StoriesAPI extends BaseAPI {
  fetch(params) {
    return this.$get('/stories', params)
  }

  async add(data) {
    const { id } = await this.$put('/stories', data)
    return id
  }

  love(id) {
    return this.$post('/stories', { id, action: 'Like' })
  }

  unlove(id) {
    return this.$post('/stories', { id, action: 'Unlike' })
  }
}
