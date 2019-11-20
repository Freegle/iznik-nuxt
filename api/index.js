import SessionAPI from './SessionAPI'
import CommunityEventAPI from '@/api/CommunityEventAPI'

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
    })
  }
}
