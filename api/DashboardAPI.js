import BaseAPI from '@/api/BaseAPI'

export default class DashboardAPI extends BaseAPI {
  async fetch(params) {
    const { dashboard, components } = await this.$get('/dashboard', params)
    return dashboard || components
  }

  async fetchHeatmap() {
    const { heatmap } = await this.$get('/dashboard', { heatmap: true })
    return heatmap
  }
}
