import { APIError } from './BaseAPI'

export default class JobAPI {
  constructor({ $axios }) {
    this.$axios = $axios
  }

  async fetch(params) {
    // Note that the server side proxy we use to bypass CORS and get the jobs is not part of the API and therefore we
    // don't use the usual API methods.
    const path = '/adview.php'
    // return // CC
    const { status, data } = await this.$axios.get(process.env.USER_SITE + path, { params })
    //const { status, data } = await this.$axios.get(path, { params })
    if (data && data.data) {
      return data.data
    } else {
      throw new APIError(
        {
          request: {
            method: 'GET',
            path,
            params
          },
          response: {
            status,
            data
          }
        },
        'Jobs API call failed'
      )
    }
  }
}
