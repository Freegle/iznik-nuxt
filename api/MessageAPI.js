import BaseAPI from '@/api/BaseAPI'

export default class MessageAPI extends BaseAPI {
  fetch(params, logError = true) {
    return this.$get('/message', params, logError)
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

  joinAndPost(id, email, logError = true) {
    return this.$post(
      '/message',
      { id, email, action: 'JoinAndPost' },
      logError
    )
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

  view(id) {
    return this.$post('/message', {
      action: 'View',
      id: id
    })
  }

  approve(id, groupid, subject = null, stdmsgid = null, body = null) {
    return this.$post('/message', {
      action: 'Approve',
      id: id,
      groupid: groupid,
      subject: subject,
      stdmsgid: stdmsgid,
      body: body
    })
  }

  reply(id, groupid, subject = null, stdmsgid = null, body = null) {
    return this.$post('/message', {
      action: 'Reply',
      id: id,
      groupid: groupid,
      subject: subject,
      stdmsgid: stdmsgid,
      body: body
    })
  }

  reject(id, groupid, subject = null, stdmsgid = null, body = null) {
    return this.$post('/message', {
      action: 'Reject',
      id: id,
      groupid: groupid,
      subject: subject,
      stdmsgid: stdmsgid,
      body: body
    })
  }

  delete(id, groupid, subject = null, stdmsgid = null, body = null) {
    return this.$post('/message', {
      action: 'Delete',
      id: id,
      groupid: groupid,
      subject: subject,
      stdmsgid: stdmsgid,
      body: body
    })
  }

  spam(id, groupid) {
    return this.$post('/message', {
      action: 'Spam',
      id: id,
      groupid: groupid
    })
  }

  notspam(id, groupid) {
    return this.$post('/message', {
      action: 'NotSpam',
      id: id,
      groupid: groupid
    })
  }

  hold(id) {
    return this.$post('/message', {
      action: 'Hold',
      id: id
    })
  }

  release(id) {
    return this.$post('/message', {
      action: 'Release',
      id: id
    })
  }

  approveEdits(id) {
    return this.$post('/message', {
      action: 'ApproveEdits',
      id: id
    })
  }

  revertEdits(id) {
    return this.$post('/message', {
      action: 'RevertEdits',
      id: id
    })
  }

  partnerConsent(id, partner) {
    return this.$post('/message', {
      action: 'PartnerConsent',
      id,
      partner
    })
  }

  addBy(id, userid, count) {
    return this.$post('/message', {
      action: 'AddBy',
      id,
      userid,
      count
    })
  }

  removeBy(id, userid, count) {
    return this.$post('/message', {
      action: 'RemoveBy',
      id,
      userid,
      count
    })
  }
}
