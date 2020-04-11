import BaseAPI from '@/api/BaseAPI'

export default class UserAPI extends BaseAPI {
  async fetch(params) {
    const { user, users, logcontext } = await this.$get('/user', params)

    if (user) {
      user.logcontext = logcontext
      return user
    } else {
      return users
    }
  }

  rate(id, rating) {
    return this.$post('/user', { ratee: id, rating, action: 'Rate' })
  }

  unbounce(id) {
    return this.$post('/user', { id: id, action: 'Unbounce' })
  }

  addEmail(id, email) {
    return this.$post('/user', { id: id, action: 'AddEmail', email: email })
  }

  add(email) {
    return this.$put('/user', { email: email })
  }

  save(event) {
    return this.$patch('/user', event)
  }

  purge(id) {
    return this.$del('/user', {
      id
    })
  }
}
