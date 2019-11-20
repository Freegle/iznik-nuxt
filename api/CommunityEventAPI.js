import BaseAPI from '@/api/BaseAPI'

export default class CommunityEventAPI extends BaseAPI {
  fetch(params) {
    return this.$get(params)
  }

  create(event) {
    return this.$post(event)
  }

  addGroup(id, groupid) {
    return this.$patch({
      id,
      groupid,
      action: 'AddGroup'
    })
  }

  removeGroup(id, groupid) {
    return this.$patch({
      id,
      groupid,
      action: 'RemoveGroup'
    })
  }

  setPhoto(id, photoid) {
    return this.$patch({
      id,
      photoid,
      action: 'SetPhoto'
    })
  }

  removeDate(id, dateid) {
    return this.$patch({
      id,
      dateid,
      action: 'RemoveDate'
    })
  }

  addDate(id, start, end) {
    return this.$patch({
      id,
      start,
      end,
      action: 'RemoveDate'
    })
  }

  save(event) {
    return this.$patch(event)
  }

  del(id) {
    return this.$del({ id })
  }
}
