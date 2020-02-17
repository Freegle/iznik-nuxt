import BaseAPI from '@/api/BaseAPI'

export default class ChatAPI extends BaseAPI {
  fetch(chatid, { limit, context }) {
    return chatid
      ? this.$get(`/chat/rooms/${chatid}/messages`, { limit, context })
      : this.$get(`/chatmessages`, { limit, context })
  }

  async listChats(params) {
    const { chatrooms } = await this.$get('/chat/rooms', params)
    return chatrooms
  }

  fetchChat(chatid) {
    return this.$get('/chatrooms', { id: chatid })
  }

  markSeen(chatid, lastmsg) {
    return this.$post('/chatrooms', { id: chatid, lastmsgseen: lastmsg })
  }

  openChat(params) {
    return this.$put('/chat/rooms', params)
  }

  send(data) {
    return this.$post('/chatmessages', data, function(data) {
      if (data && data.ret === 4) {
        // Don't log errors for banned users.
        return false
      } else {
        return true
      }
    })
  }

  nudge(chatid) {
    return this.$post('/chatrooms', {
      id: chatid,
      action: 'Nudge'
    })
  }

  hideChat(chatid) {
    return this.$post('/chatrooms', { id: chatid, status: 'Closed' })
  }

  blockChat(chatid) {
    return this.$post('/chatrooms', { id: chatid, status: 'Blocked' })
  }

  unseenCount(chatid) {
    return this.$get('/chatrooms', { count: true })
  }

  hold(msgid) {
    return this.$post('/chatmessages', { id: msgid, action: 'Hold' })
  }

  release(msgid) {
    return this.$post('/chatmessages', { id: msgid, action: 'Release' })
  }

  reject(msgid) {
    return this.$post('/chatmessages', { id: msgid, action: 'Reject' })
  }

  approve(msgid) {
    return this.$post('/chatmessages', { id: msgid, action: 'Approve' })
  }

  whitelist(msgid) {
    return this.$post('/chatmessages', {
      id: msgid,
      action: 'ApproveAllFuture'
    })
  }

  rsvp(chatid, id, value) {
    return this.$patch('/chatmessages', {
      chatid: chatid,
      id: id,
      replyexpected: value
    })
  }
}
