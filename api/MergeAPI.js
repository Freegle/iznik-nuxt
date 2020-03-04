import BaseAPI from '@/api/BaseAPI'

export default class MergeAPI extends BaseAPI {
  async fetch(params) {
    const ret = await this.$get('/merge', params)
    return ret.merge
  }

  ask(params) {
    return this.$put('/merge', params)
  }

  accept(params) {
    return this.$post('/merge', {
      id: params.id,
      uid: params.uid,
      user1: params.user1,
      user2: params.user2,
      action: 'Accept'
    })
  }

  reject(params) {
    return this.$post('/merge', {
      id: params.id,
      uid: params.uid,
      action: 'Reject'
    })
  }
}
