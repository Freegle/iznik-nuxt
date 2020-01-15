import BaseAPI from '@/api/BaseAPI'

export default class MessageAPI extends BaseAPI {
  fetch(params) {
    return this.$get('/message', params)
  }

  fetchMessages(params) {
    return this.$get('/messages', params)
  }

  update(event) {
    return this.$post('/message', event)
  }

  save(event) {
    return this.$patch('/message', event)
  }

  joinAndPost(id, email) {
    return this.$post('/message', { id, email, action: 'JoinAndPost' })
  }

  del(id) {
    return this.$del('/message', { id })
  }

  put(data) {
    return this.$put('/message', data)
  }

  intend(id, outcome) {
    return this.$post('/message', {
      action: 'OutcomeIntended',
      id: id,
      outcome: outcome
    })
  }
}
