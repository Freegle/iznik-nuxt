import BaseAPI from '@/api/BaseAPI'

export default class NotificationAPI extends BaseAPI {
  seen(id) {
    return this.$post('/notification', { id, action: 'Seen' })
  }

  allSeen() {
    return this.$post('/notification', { action: 'AllSeen' })
  }
}
