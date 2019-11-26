import ActivityAPI from './ActivityAPI'
import AddressAPI from './AddressAPI'
import CommunityEventAPI from './CommunityEventAPI'
import MessageAPI from './MessageAPI'
import MembershipsAPI from './MembershipsAPI'
import SessionAPI from './SessionAPI'

interface API {
  activity: ActivityAPI;
  address: AddressAPI;
  communityevent: CommunityEventAPI;
  message: MessageAPI;
  memberships: MembershipsAPI;
  session: SessionAPI;
}

declare module 'vue/types/vue' {
  interface Vue {
    $api: API;
  }
}
