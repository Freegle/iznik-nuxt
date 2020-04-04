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

  save(event) {
    return this.$patch('/memberships', event)
  }

  del(id) {
    return this.$del('/memberships', { id })
  }

  put(data) {
    return this.$put('/memberships', data)
  }

  approve(userid, groupid, subject = null, stdmsgid = null, body = null) {
    return this.$post('/memberships', {
      action: 'Approve Member',
      userid: userid,
      groupid: groupid,
      subject: subject,
      stdmsgid: stdmsgid,
      body: body
    })
  }

  reply(userid, groupid, subject = null, stdmsgid = null, body = null) {
    return this.$post('/memberships', {
      action: 'Leave Approved Member',
      userid: userid,
      groupid: groupid,
      subject: subject,
      stdmsgid: stdmsgid,
      body: body
    })
  }

  reject(userid, groupid, subject = null, stdmsgid = null, body = null) {
    return this.$post('/memberships', {
      action: 'Reject Member',
      userid: userid,
      groupid: groupid,
      subject: subject,
      stdmsgid: stdmsgid,
      body: body
    })
  }

  delete(userid, groupid, subject = null, stdmsgid = null, body = null) {
    return this.$post('/memberships', {
      action: 'Delete Approved Member',
      userid: userid,
      groupid: groupid,
      subject: subject,
      stdmsgid: stdmsgid,
      body: body
    })
  }

  remove(userid, groupid) {
    return this.$del('/memberships', {
      userid: userid,
      groupid: groupid
    })
  }

  ban(userid, groupid) {
    return this.$del('/memberships', {
      userid: userid,
      groupid: groupid,
      ban: true
    })
  }

  hold(userid, groupid) {
    return this.$post('/memberships', {
      action: 'Hold',
      userid: userid,
      groupid: groupid
    })
  }

  release(userid, groupid) {
    return this.$post('/memberships', {
      action: 'Release',
      userid: userid,
      groupid: groupid
    })
  }

  happinessReviewed(params) {
    return this.$post('/memberships', params)
  }
}
