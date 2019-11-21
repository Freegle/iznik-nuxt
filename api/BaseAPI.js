export class APIError extends Error {
  constructor({ request, response }, message) {
    super(message)
    Object.assign(this, { request, response })
  }
}

export default class BaseAPI {
  constructor({ $axios, path }) {
    this.$axios = $axios
    this.$path = path
  }

  async $request(method, config) {
    const { status, data } = await this.$axios.request({
      ...config,
      method,
      url: this.$path,
      baseURL: process.env.API
    })
    if (status !== 200 || data.ret !== 0) {
      const message = [
        'API Error',
        method,
        this.$path,
        '->',
        `ret: ${data.ret} status: ${data.status || 'Unknown'}`
      ].join(' ')
      throw new APIError(
        {
          request: {
            path: this.$path,
            method: method,
            headers: config.headers,
            params: config.params,
            data: config.data
          },
          response: {
            status,
            data
          }
        },
        message
      )
    }
    return data
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

  $realPut(data) {
    return this.$request('PUT', { data })
  }

  $patch(data) {
    return this.$postOverride('PATCH', data)
  }

  $del(data, config = {}) {
    return this.$postOverride('DELETE', data)
  }
}
