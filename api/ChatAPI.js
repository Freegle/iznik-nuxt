import BaseAPI from '@/api/BaseAPI'

export default class ChatAPI extends BaseAPI {
  fetch(chatid, { limit, context }) {
    return chatid
      ? this.$get(
          `/chat/rooms/${chatid}/messages`,
          { limit, context },
          function(data) {
            if (data && data.ret === 2) {
              // We handle this in the chat page
              return false
            } else {
              return true
            }
          }
        )
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
        // Don't log errors for banned users - handled elsewhere.
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
    const modtools = this.store.getters['misc/get']('modtools')
    return this.$get('/chatrooms', {
      count: true,
      chattypes: modtools ? ['User2Mod', 'Mod2Mod'] : ['User2User', 'User2Mod']
    })
  }

  hold(msgid) {
    return this.$post('/chatmessages', { id: msgid, action: 'Hold' })
  }

  release(msgid) {
    return this.$post('/chatmessages', { id: msgid, action: 'Release' })
  }

  redact(msgid) {
    return this.$post('/chatmessages', { id: msgid, action: 'Redact' })
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
      roomid: chatid,
      id: id,
      replyexpected: value
    })
  }
}
