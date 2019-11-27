export class APIError extends Error {
  constructor({ request, response }, message) {
    super(message)
    Object.assign(this, { request, response })
  }
}

export default class BaseAPI {
  constructor({ $axios }) {
    this.$axios = $axios
  }

  async $request(method, path, config) {
    const { status, data } = await this.$axios.request({
      ...config,
      method,
      url: path,
      baseURL: process.env.API
    })
    if (status !== 200 || data.ret !== 0) {
      const message = [
        'API Error',
        method,
        path,
        '->',
        `ret: ${data.ret} status: ${data.status || 'Unknown'}`
      ].join(' ')
      throw new APIError(
        {
          request: {
            path,
            method,
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

  $get(path, params = {}) {
    return this.$request('GET', path, { params })
  }

  $post(path, data) {
    return this.$request('POST', path, { data })
  }

  $postOverride(overrideMethod, path, data) {
    return this.$request('POST', path, {
      data,
      headers: {
        'X-HTTP-Method-Override': overrideMethod
      }
    })
  }

  $put(path, data) {
    return this.$postOverride('PUT', path, data)
  }

  $realPut(path, data) {
    return this.$request('PUT', path, { data })
  }

  $patch(path, data) {
    return this.$postOverride('PATCH', path, data)
  }

  $del(path, data, config = {}) {
    return this.$postOverride('DELETE', path, data)
  }
}
