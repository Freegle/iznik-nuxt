import BaseAPI from '@/api/BaseAPI'

export default class TeamAPI extends BaseAPI {
  async fetch(params) {
    const { team, teams } = await this.$get('/team', params)
    return teams || team
  }

  async remove(id, userid) {
    await this.$patch('/team', {
      id,
      userid,
      action: 'Remove'
    })
  }

  async add(id, userid) {
    await this.$patch('/team', {
      id,
      userid,
      action: 'Add'
    })
  }
}
