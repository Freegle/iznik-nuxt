import BaseAPI from '@/api/BaseAPI'

export default class MembershipsAPI extends BaseAPI {
  update(data) {
    return this.$patch(data)
  }

  joinGroup(data) {
    return this.$put(data)
  }

  leaveGroup(data) {
    return this.$del(data)
  }
}
