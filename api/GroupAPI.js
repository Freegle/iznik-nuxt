import BaseAPI from '@/api/BaseAPI'

export default class GroupAPI extends BaseAPI {
  async list(params) {
    const { groups } = await this.$get('/groups', params)
    return groups
  }

  async fetch(id, log) {
    const { group } = await this.$get('/group', { id }, log)
    return group
  }
}
