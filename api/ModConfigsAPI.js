import BaseAPI from '@/api/BaseAPI'

export default class ModConfigsAPI extends BaseAPI {
  fetchStdMsg(id) {
    return this.$get('/stdmsg', {
      id,
      modtools: true
    })
  }
}
