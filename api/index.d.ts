import SessionAPI from './SessionAPI'
import CommunityEventAPI from './CommunityEventAPI'

interface API {
  session: SessionAPI;
  communityevent: CommunityEventAPI;
}

declare module 'vue/types/vue' {
  interface Vue {
    $api: API;
  }
}
