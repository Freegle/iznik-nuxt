import BaseAPI from '@/api/BaseAPI'

export default class GroupAPI extends BaseAPI {
  async list(params) {
    const { groups } = await this.$get('/groups', params)
    return groups
  }

  async fetch(id) {
    const { group } = await this.$get('/group', { id })
    return group
  }
}
