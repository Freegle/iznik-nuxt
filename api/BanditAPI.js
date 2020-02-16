import BaseAPI from '@/api/BaseAPI'

export default class ChatAPI extends BaseAPI {
  async choose({ uid }) {
    const ret = await this.$get('/abtest', { uid })
    return ret.variant
  }

  shown({ uid, variant }) {
    return this.$post('/abtest', { uid, variant, shown: true })
  }

  chosen({ uid, variant, score }) {
    return this.$post('/abtest', { uid, variant, action: true, score })
  }
}
