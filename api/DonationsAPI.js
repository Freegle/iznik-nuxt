import BaseAPI from '@/api/BaseAPI'

export default class DonationsAPI extends BaseAPI {
  async fetch(groupid = null) {
    const { target, raised } = await this.$get('/donations', { groupid })
    return {
      target: Math.round(parseInt(target)),
      raised: Math.round(parseInt(raised))
    }
  }
}
