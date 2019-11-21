import SessionAPI from '@/api/SessionAPI'
import CommunityEventAPI from '@/api/CommunityEventAPI'
import MessageAPI from '@/api/MessageAPI'

export default ({ $axios }) => {
  const options = { $axios }
  return {
    session: new SessionAPI({
      ...options,
      path: '/session'
    }),

    communityevent: new CommunityEventAPI({
      ...options,
      path: '/communityevent'
    }),

    message: new MessageAPI({
      ...options,
      path: '/message'
    })
  }
}
