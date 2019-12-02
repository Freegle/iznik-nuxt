import BaseAPI from '@/api/BaseAPI'

export default class JobAPI extends BaseAPI {
  async fetch(params) {
    // Note that the server side proxy we use to bypass CORS and get the jobs is not part of the API and therefore we
    // don't use the usual API plugin.
    const { data } = await this.$axios.get('/adview.php', params)
    return data
  }
}
