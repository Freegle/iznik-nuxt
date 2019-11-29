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
import AuthorityAPI from './AuthorityAPI.js'
import ChatAPI from './ChatAPI.js'
import CommunityEventAPI from './CommunityEventAPI.js'
import DashboardAPI from './DashboardAPI.js'
import DonationsAPI from './DonationsAPI.js'
import GroupAPI from './GroupAPI.js'
import InvitationAPI from './InvitationAPI.js'
import JobAPI from './JobAPI.js'
import MembershipsAPI from './MembershipsAPI.js'
import MessageAPI from './MessageAPI.js'
import NewsAPI from './NewsAPI.js'
import NoticeboardAPI from './NoticeboardAPI.js'
import NotificationAPI from './NotificationAPI.js'
import ScheduleAPI from './ScheduleAPI.js'
import SessionAPI from './SessionAPI.js'
import StoriesAPI from './StoriesAPI.js'
import TeamAPI from './TeamAPI.js'
import UserAPI from './UserAPI.js'
import UserSearchAPI from './UserSearchAPI.js'
import VolunteeringAPI from './VolunteeringAPI.js'

export default ({ $axios }) => {
  const options = { $axios }
  return {
    activity: new ActivityAPI(options),
    address: new AddressAPI(options),
    authority: new AuthorityAPI(options),
    chat: new ChatAPI(options),
    communityevent: new CommunityEventAPI(options),
    dashboard: new DashboardAPI(options),
    donations: new DonationsAPI(options),
    group: new GroupAPI(options),
    invitation: new InvitationAPI(options),
    job: new JobAPI(options),
    memberships: new MembershipsAPI(options),
    message: new MessageAPI(options),
    news: new NewsAPI(options),
    noticeboard: new NoticeboardAPI(options),
    notification: new NotificationAPI(options),
    schedule: new ScheduleAPI(options),
    session: new SessionAPI(options),
    stories: new StoriesAPI(options),
    team: new TeamAPI(options),
    user: new UserAPI(options),
    usersearch: new UserSearchAPI(options),
    volunteering: new VolunteeringAPI(options)
  }
}
