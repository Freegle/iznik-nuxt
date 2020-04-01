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

  async deleteConfig(params) {
    await this.$del('/modconfig', params)
  }

  async patchStdMsg(params) {
    await this.$patch('/stdmsg', params)
  }

  async deleteStdMsg(params) {
    await this.$del('/stdmsg', params)
  }

  async addModConfig(data) {
    const { id } = await this.$post('/modconfig', data)
    return id
  }

  async addStdMsg(data) {
    const { id } = await this.$post('/stdmsg', data)
    return id
  }
}
