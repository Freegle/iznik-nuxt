<template>
  <div>
    <b-row class="m-0">
      <b-col cols="12" md="6" offset-md="3">
        <h1>Fetching your data</h1>
        <b-alert v-if="error" variant="danger" show>
          Something went wrong.  Please try again, and if this keeps happening then contact <a href="mailto:support@ilovefreegle.org">support@ilovefreegle.org</a>.
        </b-alert>
        <div v-else>
          <div v-if="status">
            <div v-if="status.completed">
              <div class="padleft">
                <p>
                  You might have heard that the General Data Protection Regulation (GDPR) regulation gives you the
                  "right to access" and the "right to portability" of your data. Below is
                  the personal data you have provided to Freegle (except for some temporary logging
                  information which we keep for upto 7 days), to make accessing this easy for all freeglers.
                  You can also download all this data
                  in a commonly-used machine-readable format (<a href="https://www.json.org/" target="_blank">JSON</a>).
                </p>
                <b-btn variant="white" class="mb-2" @click="download">
                  Download in machine-readable format
                </b-btn>
                <p>
                  There may be a lot of information here, so if you have any questions, please
                  <nuxt-link to="/help">
                    contact us
                  </nuxt-link>.
                </p>
                <p>
                  Freegle volunteers may also have some personal data, predominately in the form of email
                  correspondence about Freegle matters. If you want access to this please request this
                  formally via the <a href="mailto:DPO@ilovefreegle.org">Data Protection Officer (DPO)</a>
                  who will organise the return of this additional information.
                </p>
                <h2>About you</h2>
                <div class="row">
                  <div class="col-sm-6">
                    Your full name:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Your_full_name }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    Your first name:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Your_first_name }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    Your last name:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Your_last_name }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    Our internal ID for you:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Our_internal_ID_for_you }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    Your Yahoo ID:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Your_Yahoo_ID }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    Yahoo's internal ID for you:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Yahoo_internal_ID_for_you }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    Your role on the system:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Your_role_on_the_system }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    Permissions you have on the site:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Permissions_you_have_on_the_site }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    When you joined the site:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.When_you_joined_the_site | dateonly }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    When you last accessed the site:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.When_you_last_accessed_the_site | dateonly }}
                  </div>
                </div>
                <h2>Your settings</h2>
                <div class="row">
                  <div class="col-sm-6">
                    Hide profile picture:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Hide_profile_picture }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    Last location you entered:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Last_location_you_entered }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    Last location you posted from:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Last_location_you_posted_from }}
                  </div>
                </div>
                <div v-if="mod" class="row">
                  <div class="col-sm-6">
                    Show members that you are a moderator
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Show_members_that_you_are_a_moderator }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    Whether we can publish your OFFERs/WANTEDs outside the site:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Whether_we_can_publish_your_posts_outside_the_site }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    Whether we can scan your messages to protect other users:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Whether_we_can_scan_your_messages_to_protect_other_users }}
                  </div>
                </div>
                <h2>Your profile pictures</h2>
                <div v-for="image in status.data.images" :key="image.thumb">
                  <b-img-lazy thumbnail :src="image.thumb" />
                </div>
                <h2>Logins</h2>
                <p>These are the ways in which you have registered to use the site.</p>
                <div v-for="login in status.data.logins" :key="login.id">
                  <b-row>
                    <b-col cols="3">
                      {{ login.added | dateonly }}
                    </b-col>
                    <b-col cols="3">
                      <span v-if="login.type === 'Native'">Email / password</span>
                      <span v-else-if="login.type === 'Link'">Email link / password</span>
                      <span v-else>
                        {{ login.type }}
                      </span>
                    </b-col>
                    <b-col cols="3">
                      Last used {{ login.lastaccess | dateonly }}
                    </b-col>
                  </b-row>
                </div>
                <h2>Email addresses</h2>
                <div class="row">
                  <div class="col-sm-6">
                    Whether your preferred email is bouncing:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Whether_your_email_is_bouncing }}
                  </div>
                </div>
                <br>
                <div v-for="email in status.data.emails" :key="email.id">
                  <b-row v-if="!email.ourdomain">
                    <b-col cols="4">
                      {{ email.email }}
                    </b-col>
                    <b-col cols="3">
                      added {{ email.added | dateonly }}
                    </b-col>
                    <b-col cols="3">
                      <span v-if="validated">
                        validated {{ email.validated | dateonly }}
                      </span>
                      <span v-else>
                        not validated
                      </span>
                    </b-col>
                    <b-col cols="2">
                      <span v-if="email.preferred">
                        (preferred email)
                      </span>
                    </b-col>
                  </b-row>
                </div>
                <h2>Your addresses</h2>
                <div v-for="address in status.data.addresses" :key="address.id">
                  {{ address.singleline }}
                </div>
                <h2>Notifications</h2>
                <div class="row">
                  <div class="col-sm-6">
                    Send Facebook notifications:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Notifications.Send_Facebook_notifications }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    Send notifications for Android/IOS apps:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Notifications.Send_notifications_for_apps }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    Send push notifications to web browsers:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Notifications.Send_push_notifications_to_web_browsers }}
                  </div>
                </div>
                <div v-if="mod" class="row">
                  <div class="col-sm-6">
                    Send email notifications of mod work:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Send_notifications_of_mod_work }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    Send email notifications for chat messages:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Notifications.Send_email_notifications_for_chat_messages }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    Send email notifications of chat messages you send:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Notifications.Send_email_notifications_of_chat_messages_you_send }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    Send emails about notifications on the site:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Notifications.Send_emails_about_notifications_on_the_site }}
                  </div>
                </div>
                <div v-if="status.data.phone">
                  <h2>Phone number</h2>
                  <p>{{ status.data.phone }}</p>
                </div>
                <h2>Memberships</h2>
                <p>
                  Which communities you are a member of.  You can change your settings or leave groups from
                  <nuxt-link to="/settings">
                    here
                  </nuxt-link>.
                </p>
                <div v-for="membership in status.data.memberships" :key="membership.id">
                  <b-row>
                    <b-col cols="4">
                      {{ membership.namedisplay }}
                    </b-col>
                    <b-col cols="4">
                      <span v-if="membership.mysettings.emailfrequency === -1">Immediately</span>
                      <span v-else-if="membership.mysettings.emailfrequency === 0">Never</span>
                      <span v-else>
                        {{ membership.mysettings.emailfrequency | pluralize('hour', { includeNumber: true }) }}
                      </span>
                    </b-col>
                    <b-col cols="4">
                      Community Event mails
                      <span v-if="membership.mysettings.eventsallowed">On</span>
                      <span v-else>Off</span>
                      <br>
                      Volunteering mails
                      <span v-if="membership.mysettings.volunteeringallowed">On</span>
                      <span v-else>Off</span>
                    </b-col>
                  </b-row>
                </div>
                <h2>Memberships History</h2>
                <p>When you joined or rejoined communities.</p>
                <div v-for="membership in status.data.membershipshistory" :key="membership.id">
                  <b-row>
                    <b-col>
                      {{ membership.namedisplay }}
                    </b-col>
                    <b-col>
                      joined {{ membership.added | dateonly }}
                    </b-col>
                  </b-row>
                </div>
                <h2>Searches</h2>
                <p>Here's what you've searched for:</p>
                <div v-for="search in status.data.searches" :key="search.id">
                  <b-row>
                    <b-col>
                      {{ search.date | dateonly }}
                    </b-col>
                    <b-col>
                      Searched for <em>{{ search.term }}</em>
                    </b-col>
                    <b-col>
                      <span v-if="search.location">
                        near {{ search.location }}
                      </span>
                    </b-col>
                  </b-row>
                </div>
                <h2>Invitations</h2>
                <div class="row">
                  <div class="col-sm-6">
                    Number of remaining invitations you can send to other people:
                  </div>
                  <div class="col-sm-6">
                    {{ status.data.Number_of_remaining_invitations_you_can_send_to_other_people }}
                  </div>
                </div>
                <br>
                <div v-for="invite in status.data.invitations" :key="invite.id">
                  You invited <em>{{ invite.email }}</em> on {{ invite.date | dateonly }}
                </div>
                <h2>Posts</h2>
                <div v-for="post in status.data.messages" :key="post.id">
                  <ExportPost :post="post" />
                </div>
                <h2>Chats</h2>
                <p>This just shows messages you have sent, not those from other people.</p>
                <div v-for="chat in status.data.chatrooms" :key="chat.id">
                  <ExportChat :chat="chat" />
                </div>
                <h2>Ratings</h2>
                <p>These are other freeglers that you have given a thumbs up or down to.</p>
                <div class="js-more js-ratings" />
                <h2>Newsfeed</h2>
                <p>This just shows what you have posted, or replies you've made.</p>
                <ul class="js-more list-unstyled js-newsfeed" />
                <h2>Newsfeed Loves</h2>
                <p>These are any ChitChat posts you've loved.</p>
                <ul class="js-more list-unstyled js-newsfeedlikes" />
                <h2>Newsfeed Reports</h2>
                <p>These are any ChitChat posts you've reported.</p>
                <ul class="js-more list-unstyled js-newsfeedreports" />
                <h2>Stories</h2>
                <p>These are any stories you've told us.</p>
                <ul class="js-more list-unstyled js-stories" />
                <h2>Stories Loves</h2>
                <p>These are any stories you've loved.</p>
                <h2>About Me</h2>
                <p>These are any "about me" info you've given us</p>
                <ul class="js-more list-unstyled js-aboutme" />
                <ul class="js-more list-unstyled js-storylikes" />
                <h2>Community Events</h2>
                <p>These are community events which you've created.</p>
                <div class="js-more js-communityevents" />
                <h2>Volunteering Opportunities</h2>
                <p>These are volunteering opportunities which you've created.</p>
                <div class="js-more js-volunteerings" />
                <div v-if="mod">
                  <h2>Alerts</h2>
                  <p>These are messages sent to volunteers from Freegle teams.</p>
                  <div class="js-more js-alerts" />
                </div>
                <h2>Donations</h2>
                <p>These are any donations you have made via the site to support Freegle.</p>
                <div class="js-more js-donations" />
                <div v-if="mod">
                  <h2>Bans</h2>
                  <p>These are users you have banned (except spammers).</p>
                  <div class="js-more js-bans" />
                </div>
                <div v-if="mod">
                  <h2>Spammers</h2>
                  <p>These are users you have reported as spammers.</p>
                  <div class="js-more js-spammers" />
                  <h2>Whitelisted domains</h2>
                  <p>
                    You see chat messages to review, and some of these may contain links.  These are domains where you have
                    marked a link as not spam.
                  </p>
                  <div class="js-more js-spamdomains" />
                </div>
                <div v-if="mod">
                  <h2>Excluded locations</h2>
                  <p>These are locations that you have excluded from the group mapping.</p>
                  <div class="js-more js-locations" />
                </div>
                <div v-if="mod">
                  <h2>Notes on users</h2>
                  <p>These are mod notes that you have made on users.</p>
                  <div class="js-more js-comments" />
                </div>
                <h2>Notifications</h2>
                <p>These are when you've clicked on notifications for the site.</p>
                <div class="js-more js-notifications" />
                <h2>Logs</h2>
                <p>
                  These are detailed internal logs relating to your activity.  There may be a very large number
                  of these, and they're not very interesting - but you can view them if you like.
                </p>
                <div class="btn btn-white js-showlogs">
                  View logs
                </div>
                <ul class="list-unstyled js-logs" />
                <h2>Exports</h2>
                <p>These are any other times you've viewed this data.</p>
                <ul class="list-unstyled js-more js-exports" />
              </div>
            </div>
            <div v-else-if="status.started">
              <notice-message variant="info">
                This may take a few minutes, so please keep this tab open and be patient...
              </notice-message>
              <b-img-lazy src="~/static/loader.gif" />
              <b-alert variant="success">
                Your data export has been started...
              </b-alert>
            </div>
            <div v-else-if="status.infront">
              <notice-message variant="info">
                This may take a few minutes, so please keep this tab open and be patient...
              </notice-message>
              <b-img-lazy src="~/static/loader.gif" />
              <b-alert variant="warning">
                You're in a queue (sorry).  Data exports ahead of you: {{ status.infront }}
              </b-alert>
            </div>
          </div>
          <div v-else class="text-center">
            <b-img-lazy src="~/static/loader.gif" />
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import loginRequired from '@/mixins/loginRequired.js'
const NoticeMessage = () => import('~/components/NoticeMessage')
const ExportPost = () => import('~/components/ExportPost')
const ExportChat = () => import('~/components/ExportChat')

export default {
  components: {
    NoticeMessage,
    ExportPost,
    ExportChat
  },
  mixins: [loginRequired],
  data: function() {
    return {
      status: null,
      id: null,
      tag: null,
      error: false,
      started: false
    }
  },
  computed: {
    me() {
      return this.$store.getters['auth/user']
    },
    mod() {
      return (
        this.me.systemrole === 'Moderator' ||
        this.me.systemrole === 'Support' ||
        this.me.systemrole === 'Admin'
      )
    }
  },
  async mounted() {
    const ret = await this.$axios.post(process.env.API + '/export')

    if (ret.status === 200 && ret.data.ret === 0 && ret.data.tag) {
      this.id = ret.data.id
      this.tag = ret.data.tag
      this.started = true
      setTimeout(this.checkStatus, 3000)
    } else {
      this.error = true
    }
  },
  methods: {
    async checkStatus() {
      const ret = await this.$axios.get(process.env.API + '/export', {
        params: {
          id: this.id,
          tag: this.tag
        }
      })

      if (ret.status === 200 && ret.data.ret === 0) {
        this.status = ret.data.export

        if (!this.status.completed) {
          // Not done yet.
          setTimeout(this.checkStatus, 3000)
        }
      } else {
        this.error = true
      }
    },
    download() {
      // TODO
    }
  }
}
</script>
