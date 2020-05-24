
/*    --- DO NOT EDIT ---
 *
 * This file was generating using api/index.generate.js
 * You can regenerate it by running:
 *
 *     node api/index.generate.js
 *
 *    --- DO NOT EDIT ---
 */


import ActivityAPI from './ActivityAPI.js'
import AddressAPI from './AddressAPI.js'
import AdminsAPI from './AdminsAPI.js'
import AlertAPI from './AlertAPI.js'
import AuthorityAPI from './AuthorityAPI.js'
import BanditAPI from './BanditAPI.js'
import ChatAPI from './ChatAPI.js'
import CommentAPI from './CommentAPI.js'
import CommunityEventAPI from './CommunityEventAPI.js'
import DashboardAPI from './DashboardAPI.js'
import DomainAPI from './DomainAPI.js'
import DonationsAPI from './DonationsAPI.js'
import GroupAPI from './GroupAPI.js'
import InvitationAPI from './InvitationAPI.js'
import JobAPI from './JobAPI.js'
import LocationAPI from './LocationAPI.js'
import LogsAPI from './LogsAPI.js'
import MembershipsAPI from './MembershipsAPI.js'
import MergeAPI from './MergeAPI.js'
import MessageAPI from './MessageAPI.js'
import ModConfigsAPI from './ModConfigsAPI.js'
import NewsAPI from './NewsAPI.js'
import NoticeboardAPI from './NoticeboardAPI.js'
import NotificationAPI from './NotificationAPI.js'
import ScheduleAPI from './ScheduleAPI.js'
import SessionAPI from './SessionAPI.js'
import ShortlinksAPI from './ShortlinksAPI.js'
import SocialActionsAPI from './SocialActionsAPI.js'
import SpammersAPI from './SpammersAPI.js'
import StatusAPI from './StatusAPI.js'
import StoriesAPI from './StoriesAPI.js'
import TeamAPI from './TeamAPI.js'
import UserAPI from './UserAPI.js'
import UserSearchAPI from './UserSearchAPI.js'
import VolunteeringAPI from './VolunteeringAPI.js'

interface API {
  activity: ActivityAPI;
  address: AddressAPI;
  admins: AdminsAPI;
  alert: AlertAPI;
  authority: AuthorityAPI;
  bandit: BanditAPI;
  chat: ChatAPI;
  comment: CommentAPI;
  communityevent: CommunityEventAPI;
  dashboard: DashboardAPI;
  domain: DomainAPI;
  donations: DonationsAPI;
  group: GroupAPI;
  invitation: InvitationAPI;
  job: JobAPI;
  location: LocationAPI;
  logs: LogsAPI;
  memberships: MembershipsAPI;
  merge: MergeAPI;
  message: MessageAPI;
  modconfigs: ModConfigsAPI;
  news: NewsAPI;
  noticeboard: NoticeboardAPI;
  notification: NotificationAPI;
  schedule: ScheduleAPI;
  session: SessionAPI;
  shortlinks: ShortlinksAPI;
  socialactions: SocialActionsAPI;
  spammers: SpammersAPI;
  status: StatusAPI;
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