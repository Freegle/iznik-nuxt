import BaseAPI from '@/api/BaseAPI'

export default class SocialActionsAPI extends BaseAPI {
  fetch(params) {
    return this.$get('/socialactions', params)
  }

  share(id, uid) {
    return this.$post('/socialactions', { id, uid, action: 'Do' })
  }

  hide(id, uid) {
    return this.$post('/socialactions', { id, uid, action: 'Hide' })
  }
}
