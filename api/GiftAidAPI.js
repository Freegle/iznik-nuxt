import BaseAPI from '@/api/BaseAPI'

export default class GiftAidAPI extends BaseAPI {
  async get() {
    const ret = await this.$get('/giftaid', {})
    return ret.giftaid
  }

  save({ period, fullname, homeaddress }) {
    return this.$post('/giftaid', { period, fullname, homeaddress })
  }

  remove() {
    return this.$del('/giftaid')
  }
}
