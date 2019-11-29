import BaseAPI from '@/api/BaseAPI'

export default class MembershipsAPI extends BaseAPI {
  update(data) {
    return this.$patch('/memberships', data)
  }

  joinGroup(data) {
    return this.$put('/memberships', data)
  }

  leaveGroup(data) {
    return this.$del('/memberships', data)
  }
}
