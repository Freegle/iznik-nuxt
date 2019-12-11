import BaseAPI from '@/api/BaseAPI'

export default class DonationsAPI extends BaseAPI {
  async fetch(groupid = null) {
    const ret = await this.$get('/donations', { groupid })
    const { target, raised } = ret.donations
    return {
      target: Math.round(parseInt(target)),
      raised: Math.round(parseInt(raised))
    }
  }
}
