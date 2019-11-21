import SessionAPI from './SessionAPI'
import CommunityEventAPI from './CommunityEventAPI'
import MessageAPI from './MessageAPI'

interface API {
  session: SessionAPI;
  communityevent: CommunityEventAPI;
  message: MessageAPI;
}

declare module 'vue/types/vue' {
  interface Vue {
    $api: API;
  }
}
