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
    news: new NewsAPI(options),
    noticeboard: new NoticeboardAPI(options),
    notification: new NotificationAPI(options),
    message: new MessageAPI(options),
    schedule: new ScheduleAPI(options),
    session: new SessionAPI(options),
    stories: new StoriesAPI(options),
    team: new TeamAPI(options),
    user: new UserAPI(options),
    usersearch: new UserSearchAPI(options),
    volunteering: new VolunteeringAPI(options)
  }
}
