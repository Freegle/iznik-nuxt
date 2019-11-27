import BaseAPI from '@/api/BaseAPI'

export default class UserSearchAPI extends BaseAPI {
  async list(params) {
    const { usersearches } = await this.$get('/usersearch', params)
    return usersearches
  }

  del(id) {
    return this.$del('/usersearch', { id })
  }
}
