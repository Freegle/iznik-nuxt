import BaseAPI from '@/api/BaseAPI'

export default class ChatAPI extends BaseAPI {
  fetch(chatid, { limit, context }) {
    return this.$get(`/chat/rooms/${chatid}/messages`, { limit, context })
  }

  fetchRoom(chatid) {
    return this.$get('/chatrooms', { id: chatid })
  }

  markSeen(chatid, lastmsg) {
    return this.$post('/chatrooms', { id: chatid, lastmsgseen: lastmsg })
  }

  openChat(params) {
    return this.$put('/chat/rooms', params)
  }

  send(data) {
    return this.$post('/chatmessages', data)
  }

  nudge(roomid) {
    return this.$post('/chatrooms', {
      id: roomid,
      action: 'Nudge'
    })
  }
}
