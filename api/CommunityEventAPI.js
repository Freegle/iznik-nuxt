import BaseAPI from '@/api/BaseAPI'

export default class CommunityEventAPI extends BaseAPI {
  fetch(params) {
    return this.$get('/communityevent', params)
  }

  create(event) {
    return this.$post('/communityevent', event)
  }

  addGroup(id, groupid) {
    return this.$patch('/communityevent', { id, groupid, action: 'AddGroup' })
  }

  removeGroup(id, groupid) {
    return this.$patch('/communityevent', {
      id,
      groupid,
      action: 'RemoveGroup'
    })
  }

  setPhoto(id, photoid) {
    return this.$patch('/communityevent', { id, photoid, action: 'SetPhoto' })
  }

  addDate(id, start, end) {
    return this.$patch('/communityevent', { id, start, end, action: 'AddDate' })
  }

  removeDate(id, dateid) {
    return this.$patch('/communityevent', { id, dateid, action: 'RemoveDate' })
  }

  save(event) {
    return this.$patch('/communityevent', event)
  }

  del(id) {
    return this.$del('/communityevent', { id })
  }
}
