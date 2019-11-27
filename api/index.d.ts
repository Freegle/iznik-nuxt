import ActivityAPI from './ActivityAPI'
import AddressAPI from './AddressAPI'
import AuthorityAPI from './AuthorityAPI'
import ChatAPI from './ChatAPI'
import CommunityEventAPI from './CommunityEventAPI'
import DashboardAPI from './DashboardAPI'
import DonationsAPI from './DonationsAPI'
import GroupAPI from './GroupAPI'
import InvitationAPI from './InvitationAPI'
import JobAPI from './JobAPI'
import MembershipsAPI from './MembershipsAPI'
import MessageAPI from './MessageAPI'
import NewsAPI from './NewsAPI'
import NoticeboardAPI from './NoticeboardAPI'
import NotificationAPI from './NotificationAPI'
import ScheduleAPI from './ScheduleAPI'
import SessionAPI from './SessionAPI'
import StoriesAPI from './StoriesAPI'
import TeamAPI from './TeamAPI'
import UserAPI from './UserAPI'
import UserSearchAPI from './UserSearchAPI'
import VolunteeringAPI from './VolunteeringAPI'

interface API {
  activity: ActivityAPI;
  address: AddressAPI;
  authority: AuthorityAPI;
  chat: ChatAPI;
  communityevent: CommunityEventAPI;
  dashboard: DashboardAPI;
  donations: DonationsAPI;
  group: GroupAPI;
  invitation: InvitationAPI;
  job: JobAPI;
  message: MessageAPI;
  memberships: MembershipsAPI;
  news: NewsAPI;
  noticeboard: NoticeboardAPI;
  notification: NotificationAPI;
  schedule: ScheduleAPI;
  session: SessionAPI;
  stories: StoriesAPI;
  team: TeamAPI;
  user: UserAPI;
  usersearch: UserSearchAPI;
  volunteering: VolunteeringAPI;
}

declare module 'vue/types/vue' {
  interface Vue {
    $api: API;
  }
}
