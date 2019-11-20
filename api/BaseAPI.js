export default class BaseAPI {
  constructor({ $axios, path }) {
    this.$axios = $axios
    this.$path = path
  }

  async $request(method, config) {
    const res = await this.$axios.request({
      ...config,
      method,
      url: this.$path,
      baseURL: process.env.API
    })
    if (res.status !== 200 || res.data.ret !== 0) {
      console.error('API error', res)
      throw new Error('API error')
    }
    return res.data
  }

  $get(params = {}) {
    return this.$request('GET', { params })
  }

  $post(data) {
    return this.$request('POST', { data })
  }

  $postOverride(overrideMethod, data) {
    return this.$request('POST', {
      data,
      headers: {
        'X-HTTP-Method-Override': overrideMethod
      }
    })
  }

  $put(data) {
    return this.$postOverride('PUT', data)
  }

  $patch(data) {
    return this.$postOverride('PATCH', data)
  }

  $del(data, config = {}) {
    return this.$postOverride('DELETE', data)
  }
}
