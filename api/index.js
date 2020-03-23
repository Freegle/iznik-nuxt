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
import AuthorityAPI from './AuthorityAPI.js'
import BanditAPI from './BanditAPI.js'
import ChatAPI from './ChatAPI.js'
import CommentAPI from './CommentAPI.js'
import CommunityEventAPI from './CommunityEventAPI.js'
import CovidAPI from './CovidAPI.js'
import DashboardAPI from './DashboardAPI.js'
import DonationsAPI from './DonationsAPI.js'
import GroupAPI from './GroupAPI.js'
import InvitationAPI from './InvitationAPI.js'
import JobAPI from './JobAPI.js'
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
import StatusAPI from './StatusAPI.js'
import StoriesAPI from './StoriesAPI.js'
import TeamAPI from './TeamAPI.js'
import UserAPI from './UserAPI.js'
import UserSearchAPI from './UserSearchAPI.js'
import VolunteeringAPI from './VolunteeringAPI.js'

export default ({ $axios, store }) => {
  const options = { $axios, store }
  return {
    activity: new ActivityAPI(options),
    address: new AddressAPI(options),
    admins: new AdminsAPI(options),
    authority: new AuthorityAPI(options),
    bandit: new BanditAPI(options),
    chat: new ChatAPI(options),
    comment: new CommentAPI(options),
    communityevent: new CommunityEventAPI(options),
    covid: new CovidAPI(options),
    dashboard: new DashboardAPI(options),
    donations: new DonationsAPI(options),
    group: new GroupAPI(options),
    invitation: new InvitationAPI(options),
    job: new JobAPI(options),
    logs: new LogsAPI(options),
    memberships: new MembershipsAPI(options),
    merge: new MergeAPI(options),
    message: new MessageAPI(options),
    modconfigs: new ModConfigsAPI(options),
    news: new NewsAPI(options),
    noticeboard: new NoticeboardAPI(options),
    notification: new NotificationAPI(options),
    schedule: new ScheduleAPI(options),
    session: new SessionAPI(options),
    shortlinks: new ShortlinksAPI(options),
    socialactions: new SocialActionsAPI(options),
    status: new StatusAPI(options),
    stories: new StoriesAPI(options),
    team: new TeamAPI(options),
    user: new UserAPI(options),
    usersearch: new UserSearchAPI(options),
    volunteering: new VolunteeringAPI(options)
  }
}
