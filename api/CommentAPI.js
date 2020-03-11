import BaseAPI from '@/api/BaseAPI'

export default class CommentAPI extends BaseAPI {
  fetch(params) {
    return this.$get('/comment', params)
  }

  async add(data) {
    const { id } = await this.$post('/comment', data)
    return id
  }

  save(data) {
    return this.$put('/comment', data)
  }

  del(id) {
    return this.$del('/comment', { id })
  }
}
