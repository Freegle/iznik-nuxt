import BaseAPI from '@/api/BaseAPI'

export default class CovidAPI extends BaseAPI {
  record(type, info) {
    return this.$put('/covid', {
      helptype: type,
      info: info
    })
  }

  async fetchGroup(params) {
    const ret = await this.$get('/covid', params)
    return ret.covids
  }

  async fetchOne(params) {
    const ret = await this.$get('/covid', params)
    return ret.covid
  }

  async counts(params) {
    const ret = await this.$get('/covid', params)
    return ret.counts
  }

  async patch(params) {
    await this.$patch('/covid', params)
  }

  async suggest(params) {
    await this.$post('/covid', {
      helper: params.helper,
      helpee: params.helpee,
      action: 'Suggest'
    })
  }

  async remove(params) {
    await this.$post('/covid', {
      helper: params.helper,
      helpee: params.helpee,
      action: 'Remove'
    })
  }

  async dispatch(params) {
    await this.$post('/covid', {
      id: params.id,
      action: 'Dispatch'
    })
  }

  async hold(params) {
    await this.$post('/covid', {
      id: params.id,
      action: 'Hold'
    })
  }

  async release(params) {
    await this.$post('/covid', {
      id: params.id,
      action: 'Release'
    })
  }
}
