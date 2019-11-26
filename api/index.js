import ActivityAPI from './ActivityAPI'
import AddressAPI from './AddressAPI'
import CommunityEventAPI from './CommunityEventAPI'
import MessageAPI from './MessageAPI'
import MembershipsAPI from './MembershipsAPI'
import SessionAPI from './SessionAPI'

export default ({ $axios }) => {
  const options = path => ({ $axios, path })
  return {
    activity: new ActivityAPI(options('/activity')),
    address: new AddressAPI(options('/address')),
    communityevent: new CommunityEventAPI(options('/communityevent')),
    memberships: new MembershipsAPI(options('/memberships')),
    message: new MessageAPI(options('/message')),
    session: new SessionAPI(options('/session'))
  }
}
