import BaseAPI from '@/api/BaseAPI'

export default class MessageAPI extends BaseAPI {
  fetch(params) {
    return this.$get(params)
  }

  update(event) {
    return this.$post(event)
  }

  save(event) {
    return this.$patch(event)
  }

  joinAndPost(id, email) {
    return this.$post({ id, email, action: 'JoinAndPost' })
  }

  del(id) {
    return this.$del({ id })
  }

  // TODO: work out if this is actually needed like this...
  put(data) {
    return this.$realPut(data)
  }
}
