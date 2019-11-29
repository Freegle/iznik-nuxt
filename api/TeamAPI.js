import BaseAPI from '@/api/BaseAPI'

export default class TeamAPI extends BaseAPI {
  async fetch(params) {
    const { team } = await this.$get('/team', params)
    return team
  }
}
