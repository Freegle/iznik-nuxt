export class APIError extends Error {
  constructor({ request, response }, message) {
    super(message)
    Object.assign(this, { request, response })
  }
}

export class LoginError extends Error {
  constructor(ret, status) {
    super(status)
    Object.assign(this, { ret, status })
  }
}

export class SignUpError extends Error {
  constructor(ret, status) {
    super(status)
    Object.assign(this, { ret, status })
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
      url: process.env.API + path
    })

    // HTTP errors real errors.
    // data.ret holds the server error.
    // - 1 means not logged in, and that's ok.
    // - POSTs to session can return errors we want to handle.
    // - 999 can happen if people double-click, and we should just quietly drop it because the first click will
    //   probably do the right thing.
    // - otherwise pop up an error.
    if (
      status !== 200 ||
      (data.ret !== 0 &&
        !(data.ret === 1 && data.status === 'Not logged in') &&
        !(path === '/session' && method === 'POST') &&
        data.ret !== 999)
    ) {
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

  $patch(path, data) {
    return this.$postOverride('PATCH', path, data)
  }

  $del(path, data, config = {}) {
    return this.$postOverride('DELETE', path, data)
  }
}
