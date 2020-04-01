import BaseAPI from '@/api/BaseAPI'

export default class ModConfigsAPI extends BaseAPI {
  fetchStdMsg(id) {
    return this.$get('/stdmsg', {
      id
    })
  }

  async fetchConfig(params) {
    const ret = await this.$get('/modconfig', params)
    return ret.config
  }

  async patchConfig(params) {
    await this.$patch('/modconfig', params)
  }

  async patchStdMsg(params) {
    await this.$patch('/stdmsg', params)
  }
}
