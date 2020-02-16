import BaseAPI from '@/api/BaseAPI'

export default class MembershipsAPI extends BaseAPI {
  update(data) {
    return this.$patch('/memberships', data)
  }

  joinGroup(data) {
    return this.$put('/memberships', data)
  }

  leaveGroup(data) {
    return this.$del('/memberships', data)
  }

  fetch(params, logError = true) {
    return this.$get('/memberships', params, logError)
  }

  fetchMembers(params) {
    return this.$get('/memberships', params)
  }

  del(id) {
    return this.$del('/memberships', { id })
  }

  put(data) {
    return this.$put('/memberships', data)
  }

  approve(id, groupid, subject = null, stdmsgid = null, body = null) {
    return this.$post('/memberships', {
      action: 'Approve',
      id: id,
      groupid: groupid,
      subject: subject,
      stdmsgid: stdmsgid,
      body: body
    })
  }

  reply(id, groupid, subject = null, stdmsgid = null, body = null) {
    return this.$post('/memberships', {
      action: 'Reply',
      id: id,
      groupid: groupid,
      subject: subject,
      stdmsgid: stdmsgid,
      body: body
    })
  }

  reject(id, groupid, subject = null, stdmsgid = null, body = null) {
    return this.$post('/memberships', {
      action: 'Reject',
      id: id,
      groupid: groupid,
      subject: subject,
      stdmsgid: stdmsgid,
      body: body
    })
  }

  delete(id, groupid, subject = null, stdmsgid = null, body = null) {
    return this.$post('/memberships', {
      action: 'Delete',
      id: id,
      groupid: groupid,
      subject: subject,
      stdmsgid: stdmsgid,
      body: body
    })
  }

  spam(id, groupid) {
    return this.$post('/memberships', {
      action: 'Spam',
      id: id,
      groupid: groupid
    })
  }
}
