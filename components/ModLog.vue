<template>
  <b-row>
    <b-col cols="3">
      {{ log.timestamp | dateshort }}
    </b-col>
    <b-col cols="2" class="forcebreak">
      <span v-if="log.user && log.byuser && log.byuser.id !== log.user.id">
        {{ log.byuser.displayname }}
      </span>
    </b-col>
    <b-col cols="7" class="forcebreak">
      <span v-if="log.type === 'Group'">
        <span v-if="log.subtype === 'Joined'">
          Joined {{ loggroup.namedisplay }}
        </span>
        <span v-else-if="log.subtype === 'Applied'">
          Applied to {{ loggroup.namedisplay }}
        </span>
        <span v-else-if="log.subtype === 'Left'">
          <span v-if="log.user && log.byuser && log.byuser.id !== log.user.id">
            Removed member
            <span v-if="log.user.displayname && log.user.displayname.length > 1">
              {{ log.user.displayname }}
            </span>
            <span v-else>
              <em>(No name)</em>
            </span>
            #{{ log.user.id }} from {{ loggroup.namedisplay }}
            <span v-if="log.text">
              {{ log.text }}
            </span>
          </span>
          <span v-else>
            Left {{ loggroup.namedisplay }}
          </span>
        </span>
        <span v-else-if="log.subtype === 'Edit'">
          {{ log.byuser.displayname }} edited group settings
        </span>
        <span v-else-if="log.subtype === 'Autoapproved'">
          Auto-approved on {{ loggroup.namedisplay }} - not moderated in time
        </span>
        <span v-else>
          <div class="text-muted">Unknown log type {{ log.type }} subtype {{ log.subtype }}</div>
        </span>
      </span>
      <span v-if="log.type === 'Message'">
        <span v-if="log.subtype === 'Received'">
          Posted #{{ log.msgid }} <em>{{ log.message.subject }}</em>
          <span v-if="loggroup">
            to {{ loggroup.namedisplay }
          </span>
          <span v-if="log.message.sourceheader">
            via {{ log.message.sourceheader }}
          </span>
        </span>
        <span v-else-if="log.subtype === 'Autoreposted'">
          Autoreposted #{{ log.msgid }} <em>{{ log.message.subject }}</em>
          <span v-if="loggroup">
            to {{ loggroup.namedisplay }}
          </span>
          repost {{ log.text }}
        </span>
        <span v-else-if="log.subtype === 'Approved'">
          Approved message #{{ log.msgid }}
          <span v-if="log.message"><em>{{ log.message.subject }}</em></span>
          <span v-if="log.stdmsg"> using <em>{{ log.stdmsg.title }} </em></span>
          <span v-if="loggroup"> on {{ loggroup.namedisplay }}</span>
        </span>
        <span v-else-if="log.subtype === 'Rejected'">
          <NoticeMessage variant="danger">
            Rejected #{{ log.msgid }}
            <span v-if="log.message"><em>{{ log.message.subject }}</em></span>
            <span v-if="log.text && log.text.length > 0"> with <em>{{ log.text }} </em></span>
            <span v-if="log.stdmsg"> using <em>{{ log.stdmsg.title }} </em></span>
            <span v-if="loggroup"> on {{ loggroup.namedisplay }}</span>
          </NoticeMessage>
        </span>
        <span v-else-if="log.subtype === 'Replied'">
          <NoticeMessage variant="danger">
            Modmail sent
            <span v-if="log.text && log.text.length > 0">
              with <em>{{ log.text }} </em>
              <span v-if="log.stdmsg"> standard message <em>{{ log.stdmsg.title }} </em></span>
              <span v-else>
                mail
              </span>
            </span>
          </NoticeMessage>
        </span>
        <span v-else-if="log.subtype === 'Deleted'">
          <NoticeMessage variant="danger">
            Deleted #{{ log.msgid }}
            <span v-if="log.message">
              <em>{{ log.message.subject }}</em>
            </span>
            <span v-if="log.stdmsg"> using <em>{{ log.stdmsg.title }} </em></span>
            <span v-if="loggroup"> from {{ loggroup.namedisplay }}</span>
          </NoticeMessage>>
        </span>
        <span v-else-if="log.subtype === 'Hold'">
          Held #{{ log.msgid }} <span v-if="log.message"><em>{{ log.message.subject }}</em></span><span v-if="loggroup"> on {{ loggroup.namedisplay }}</span>
        </span>
        <span v-else-if="log.subtype === 'Release'">
          Released #{{ log.msgid }} <span v-if="log.message"><em>{{ log.message.subject }}</em></span><span v-if="loggroup"> on {{ loggroup.namedisplay }}</span>
        </span>
        <span v-else-if="log.subtype === 'Edit'">
          Edited #{{ log.msgid }} {{ log.text }}
          <span v-if="log.stdmsg"> using <em>{{ log.stdmsg.title }} </em></span>
        </span>
        <span v-else-if="log.subtype === 'Outcome'">
          Outcome for #{{ log.msgid }}: {{ log.text }}
        </span>
        <span v-else-if="log.subtype === 'Autoapproved'">
          Auto-approved #{{ log.msgid }} - not moderated in time
        </span>
        <span v-else-if="log.subtype === 'WorryWords'">
          Message #{{ log.msgid }} {{ log.text }}
        </span>
        <span v-else>
          <div class="text-muted">Unknown log type {{ log.type }} subtype {{ log.subtype }}</div>
        </span>
      </span>
      <span v-else-if="log.type === 'User'">
        <span v-if="log.subtype === 'YahooDeliveryType'">
          Set Yahoo Delivery Type to {{ log.text }}
        </span>
        <span v-else-if="log.subtype === 'OurPostingStatus'">
          Set Posting Status to {{ log.text }}
        </span>
        <span v-else-if="log.subtype === 'OurEmailFrequency'">
          Set Email Frequency to {{ log.text }}
        </span>
        <span v-else-if="log.subtype === 'YahooPostingStatus'">
          Set Yahoo Posting Status to {{ log.text }}
        </span>
        <span v-else-if="log.subtype === 'Login'">
          Logged in {{ log.text }}
        </span>
        <span v-else-if="log.subtype === 'Logout'">
          Logged out
        </span>
        <span v-else-if="log.subtype === 'Created'">
          Created
        </span>
        <span v-else-if="log.subtype === 'RoleChange'">
          Role on {{ loggroup.namedisplay }} changed to {{ log.text }}
        </span>
        <span v-else-if="log.subtype === 'Merged'">
          Merged with another user - {{ log.text }}
        </span>
        <span v-else-if="log.subtype === 'Approved'">
          Approved member <span v-if="user.displayname.length > 1">{{ user.displayname }}</span>
          <span v-else><em>(No name)</em></span> #{{ user.id }} on {{ loggroup.namedisplay }}
        </span>
        <span v-else-if="log.subtype === 'Rejected'">
          Rejected member {{ log.text }} on {{ loggroup.namedisplay }} using <em>{{ log.stdmsg.title }}</em>
        </span>
        <span v-else-if="log.subtype === 'Deleted'">
          Deleted member {{ log.text }} <span v-if="loggroup">on {{ loggroup.namedisplay }}</span>
        </span>
        <span v-else-if="log.subtype === 'Mailed'">
          <NoticeMessage variant="danger">
            Mod sent <span v-if="log.text && log.text.length > 0"> <em>{{ log.text }} </em></span>
            <span v-else-if="log.stdmsg">
              standard message <em>{{ log.stdmsg.title }} </em>
            </span>
            <span v-else>
              mail
            </span>
          </NoticeMessage>>
        </span>
        <span v-else-if="log.subtype === 'Hold'">
          Held member <span v-if="user.displayname.length > 1">{{ user.displayname }}</span><span v-else><em>(No name)</em></span> #{{ user.id }} on {{ loggroup.namedisplay }}
        </span>
        <span v-else-if="log.subtype === 'Release'">
          Released member <span v-if="user.displayname.length > 1">{{ user.displayname }}</span><span v-else><em>(No name)</em></span> #{{ user.id }} on {{ loggroup.namedisplay }}
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
        <span v-else-if="log.subtype === 'YahooApplied'">
          Triggered application to Yahoo Group {{ loggroup.namedisplay }}.
        </span>
        <span v-else-if="log.subtype === 'YahooJoined'">
          Yahoo informed us that the member {{ log.text }} has joined {{ loggroup.namedisplay }}.
        </span>
        <span v-else-if="log.subtype === 'YahooConfirmed'">
          Confirmed join request to Yahoo for member {{ log.text }} on {{ loggroup.namedisplay }}.
        </span>
        <span v-else-if="log.subtype === 'SuspendMail'">
          Stop mailing this member as they are bouncing.
        </span>
        <span v-else-if="log.subtype === 'Bounce'">
          {{ log.text }}
        </span>
        <span v-else-if="log.subtype === 'Unbounce'">
          Reactivated to not bouncing
        </span>
        <span v-else>
          <div class="text-muted">Unknown log type {{ log.type }} subtype {{ log.subtype }}</div>
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
          <div class="text-muted">Unknown log type {{ log.type }} subtype {{ log.subtype }}</div>
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
          {{ JSON.stringify(log.stdmsg) }}
        </span>
        <span v-else>
          <div class="text-muted">Unknown log type {{ log.type }} subtype {{ log.subtype }}</div>
        </span>
      </span>
    </b-col>
  </b-row>
</template>
<script>
import NoticeMessage from './NoticeMessage'
export default {
  components: { NoticeMessage },
  props: {
    user: {
      type: Object,
      required: true
    },
    log: {
      type: Object,
      required: true
    }
  },
  computed: {
    loggroup() {
      return (
        this.log.group || {
          id: -1,
          namedisplay: '(Deleted group)'
        }
      )
    }
  }
}
</script>
