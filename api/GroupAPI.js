import BaseAPI from '@/api/BaseAPI'

export default class GroupAPI extends BaseAPI {
  async list(params) {
    const { groups } = await this.$get('/groups', params)
    return groups
  }

  async fetch(id, polygon, log) {
    const { group } = await this.$get('/group', { id, polygon }, log)
    return group
  }

  async patch(params) {
    await this.$patch('/group', params)
  }

  async add(params) {
    const { id } = await this.$post('/group', params)
    return id
  }
}
