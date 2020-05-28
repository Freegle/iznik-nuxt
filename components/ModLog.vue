<template>
  <div>
    <b-row>
      <b-col cols="5" lg="2" class="small">
        {{ log.timestamp | datetimeshort }}
      </b-col>
      <b-col cols="7" lg="4" class="forcebreak">
        <ModLogUser v-if="log.user && log.byuser && log.byuser.id !== log.user.id" :user="log.byuser" />
        <ModLogUser v-else-if="log.byuser" :user="log.byuser" />
        <ModLogUser v-else-if="log.user" :user="log.user" />
        <ModLogUser v-else-if="log.message" :user="log.message.fromuser" />
      </b-col>
      <b-col cols="12" lg="6" class="forcebreak">
        <span v-if="log.type === 'Group'">
          <span v-if="log.subtype === 'Joined'">
            Joined
            <ModLogGroup :log="log" />
          </span>
          <span v-else-if="log.subtype === 'Applied'">
            Applied to <ModLogGroup :log="log" />
          </span>
          <span v-else-if="log.subtype === 'Left'">
            <span v-if="log.user && log.byuser && log.byuser.id !== log.user.id">
              Removed member <ModLogUser :user="log.user" /> from <ModLogGroup :log="log" />
              <span v-if="log.text">
                {{ log.text }}
              </span>
            </span>
            <span v-else>
              Left <ModLogGroup :log="log" />
            </span>
          </span>
          <span v-else-if="log.subtype === 'Edit'">
            Edited group settings <ModLogGroup :log="log" tag="for" />
          </span>
          <span v-else-if="log.subtype === 'Autoapproved'">
            Auto-approved <ModLogMessage :log="log" /> <ModLogGroup :log="log" tag="on" />
          </span>
          <span v-else>
            <span class="text-muted">Unknown log type {{ log.type }} subtype {{ log.subtype }}</span>
          </span>
        </span>
        <span v-if="log.type === 'Message'">
          <span v-if="log.subtype === 'Received'">
            <span v-if="log.message && (log.message.type === 'Offer' || log.message.type === 'Wanted')">
              Posted <ModLogMessage :log="log" notext tag="to" />
              <span v-if="sourceheader" class="text-muted small">
                via {{ sourceheader }}
              </span>
              <span v-if="log.message.groups && log.message.groups[0].collection === 'Pending'" class="text-warning">
                currently {{ log.message.groups[0].collection }}
              </span>
            </span>
            <span v-else-if="log.message">
              Emailed <em>{{ log.message.subject }}</em> to <em>{{ log.message.envelopeto }}</em>
            </span>
          </span>
          <span v-else-if="log.subtype === 'Autoreposted'">
            Autoreposted <ModLogMessage :log="log" />
            repost {{ log.text }}
          </span>
          <span v-else-if="log.subtype === 'Approved'">
            Approved message
            <ModLogMessage :log="log" />
          </span>
          <span v-else-if="log.subtype === 'ClassifiedSpam'">
            Sent spam <ModLogMessage :log="log" tag="to" notext />
          </span>
          <span v-else-if="log.subtype === 'Rejected'" class="text-danger">
            Rejected
            <ModLogMessage :log="log" />
          </span>
          <span v-else-if="log.subtype === 'Replied'" class="text-danger">
            Modmail sent
            <span v-if="log.text && log.text.length > 0">
              with <em>{{ log.text }} </em>
              <span v-if="log.stdmsg"> using <em>{{ log.stdmsg.title }} </em></span>
              <span v-else>
                mail
              </span>
            </span>
          </span>
          <span v-else-if="log.subtype === 'Deleted'" class="text-danger">
            Deleted <ModLogMessage :log="log" />
          </span>
          <span v-else-if="log.subtype === 'Hold'">
            Held <ModLogMessage :log="log" />
          </span>
          <span v-else-if="log.subtype === 'Release'">
            Released <ModLogMessage :log="log" />
          </span>
          <span v-else-if="log.subtype === 'Edit'">
            Edited <ModLogMessage :log="log" notext />
            Details:
            {{ log.text }}
          </span>
          <span v-else-if="log.subtype === 'Outcome'">
            Marked <ModLogMessage :log="log" notext /> as <em>{{ log.text }}</em>
          </span>
          <span v-else-if="log.subtype === 'Autoapproved'">
            Auto-approved <ModLogMessage :log="log" />
          </span>
          <span v-else-if="log.subtype === 'WorryWords'" class="text-danger">
            Flagged <ModLogMessage :log="log" notext /> {{ log.text }}
          </span>
          <span v-else>
            <span class="text-muted">Unknown log type {{ log.type }} subtype {{ log.subtype }}</span>
          </span>
        </span>
        <span v-else-if="log.type === 'User'">
          <span v-if="log.subtype === 'OurPostingStatus'">
            <span v-if="log.group">
              Set Posting Status to {{ postingStatus }} <ModLogGroup :log="log" tag="on" />
            </span>
            <span v-else />
          </span>
          <span v-else-if="log.subtype === 'OurEmailFrequency'">
            Set Email Frequency to {{ log.text }} <ModLogGroup :log="log" tag="on" />
          </span>
          <span v-else-if="log.subtype === 'Login'">
            Logged in <em class="text-muted small">{{ log.text }}</em>
          </span>
          <span v-else-if="log.subtype === 'Logout'">
            Logged out
          </span>
          <span v-else-if="log.subtype === 'Created'">
            User Created
          </span>
          <span v-else-if="log.subtype === 'RoleChange'">
            Role <ModLogGroup :log="log" tag="on" /> changed to {{ log.text }}
          </span>
          <span v-else-if="log.subtype === 'Merged'">
            Merged with another user - {{ log.text }}
          </span>
          <span v-else-if="log.subtype === 'Approved'">
            Approved member
            <ModLogUser :user="log.user" />
            <ModLogGroup :log="log" tag="on" />
            <ModLogStdMsg :log="log" />
          </span>
          <span v-else-if="log.subtype === 'Rejected'">
            Rejected member
            <ModLogUser :user="log.user" />
            <ModLogGroup :log="log" tag="on" />
            <ModLogStdMsg :log="log" />
          </span>
          <span v-else-if="log.subtype === 'Deleted'">
            Rejected member
            <ModLogUser :user="log.user" />
            <ModLogGroup :log="log" tag="on" />
            <ModLogStdMsg :log="log" />
          </span>
          <span v-else-if="log.subtype === 'Mailed'" class="text-danger">
            Mod sent <span v-if="log.text && log.text.length > 0"> <em>{{ log.text }} </em></span>
            <ModLogStdMsg :log="log" />
          </span>
          <span v-else-if="log.subtype === 'Hold'">
            Held member
            <ModLogUser :user="log.user" />
            <ModLogGroup :log="log" tag="on" />
          </span>
          <span v-else-if="log.subtype === 'Release'">
            Released member
            <ModLogUser :user="log.user" />
            <ModLogGroup :log="log" tag="on" />
          </span>
          <span v-else-if="log.subtype === 'Suspect'">
            Detected as suspicious<span v-if="log.text">: {{ log.text }}</span>
          </span>
          <span v-else-if="log.subtype === 'Split'">
            Split out into two users - {{ log.text }}
          </span>
          <span v-else-if="log.subtype === 'MailOff'">
            Turned digests off by email
          </span>
          <span v-else-if="log.subtype === 'EventsOff'">
            Turned events off by email
          </span>
          <span v-else-if="log.subtype === 'NewslettersOff'">
            Turned newsletters off by email
          </span>
          <span v-else-if="log.subtype === 'RelevantOff'">
            Turned off "interested in" mails by email
          </span>
          <span v-else-if="log.subtype === 'VolunteersOff'">
            Turned off volunteering mails by email
          </span>
          <span v-else-if="log.subtype === 'SuspendMail'">
            Stop mailing this member as they are bouncing.
          </span>
          <span v-else-if="log.subtype === 'Bounce'">
            {{ log.text }}
          </span>
          <span v-else-if="log.subtype === 'Unbounce'">
            Reactivated to start sending mail again
          </span>
          <span v-else>
            <span class="text-muted">Unknown log type {{ log.type }} subtype {{ log.subtype }}</span>
          </span>
        </span>
        <span v-else-if="log.type === 'Config'">
          <span v-if="log.subtype === 'Created'">
            Created config {{ log.text }}
          </span>
          <span v-else-if="log.subtype === 'Deleted'">
            Deleted config {{ log.text }}
          </span>
          <span v-else-if="log.subtype === 'Edit'">
            Edited config {{ config.name }}
          </span>
          <span v-else>
            <span class="text-muted">Unknown log type {{ log.type }} subtype {{ log.subtype }}</span>
          </span>
        </span>
        <span v-else-if="log.type === 'StdMsg'">
          <span v-if="log.subtype === 'Created'">
            Created standard message {{ log.text }}
          </span>
          <span v-else-if="log.subtype === 'Deleted'">
            Deleted standard message {{ log.text }}
          </span>
          <span v-else-if="log.subtype === 'Edit'">
            Edited standard message <span v-if="log.stdmsg">{{ log.stdmsg.name }}</span>
          </span>
          <span v-else>
            <span class="text-muted">Unknown log type {{ log.type }} subtype {{ log.subtype }}</span>
          </span>
        </span>
      </b-col>
    </b-row>
    <hr class="d-block d-md-none">
  </div>
</template>
<script>
import ModLogUser from './ModLogUser'
import ModLogGroup from './ModLogGroup'
import ModLogMessage from './ModLogMessage'
import ModLogStdMsg from './ModLogStdMsg'
export default {
  components: { ModLogStdMsg, ModLogMessage, ModLogGroup, ModLogUser },
  props: {
    log: {
      type: Object,
      required: true
    }
  },
  computed: {
    sourceheader() {
      if (this.log.message && this.log.message.sourceheader) {
        // Server returns Yahoo for now.
        return this.log.message.sourceheader.replace('Yahoo-', '')
      } else {
        return null
      }
    },
    postingStatus() {
      switch (this.log.text) {
        case 'UNCHANGED':
          return 'Unchanged'
        case 'MODERATOED':
          return 'Moerated'
        case 'DEFAULT':
          return 'Group Settings'
        case 'PROHIBITED':
          return "Can't Post"
        default:
          return null
      }
    }
  }
}
</script>
