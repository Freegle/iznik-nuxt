<template>
  <div>
    <b-row v-if="!chatmessage.sameasnext || last || chatmessage.bymailid || chatmessage.gap" class="text-muted small mb-1">
      <b-col v-if="!messageIsFromCurrentUser">
        <span class="chat__dateread--theirs" :title="datetimeshort(chatmessage.date)">
          {{ timeadapt(chatmessage.date) }}
          <span v-if="chatmessage.reviewrequired" class="text-danger small">
            Pending review
          </span>
          <span v-if="mod && chatmessage.bymailid" class="btn btn-sm mb-2 btn-white clickme" :title="'Received by email #' + chatmessage.bymailid + ' click to view'" @click="viewOriginal">
            <v-icon name="info-circle" /> View original email
          </span>
        </span>
        <b-badge v-if="chatmessage.replyexpected && !chatmessage.replyreceived" variant="danger">
          RSVP - reply expected
        </b-badge>
        <span v-if="chat.chattype === 'Mod2Mod'">
          <span v-if="chatmessage.userid === me.id">
            You
          </span>
          <span v-else-if="othermodname">
            {{ othermodname }}
          </span>
          <span v-else>
            <v-icon name="hashtag" class="text-muted" scale="0.5" />{{ chatmessage.userid }}
          </span>
          sent this
        </span>
      </b-col>
      <b-col v-else>
        <span class="float-right chat__dateread--mine">
          <span v-if="chatmessage.seenbyall" title="This message has been read.">
            <v-icon name="check" class="text-success" />
          </span>
          <span v-else-if="chatmessage.mailedtoall" title="This message has been sent out by email from our system.">
            <v-icon name="envelope" />
          </span>
          <span v-else-if="mod && chat && chat.chattype === 'User2Mod' && otheruser && otheruser.settings && otheruser.settings.notifications && !otheruser.settings.notifications.email" title="This freegler normally has email notifications turned off.  We always email messages from mods though.">
            <v-icon name="envelope" class="text-danger" />
          </span>
          <span v-else title="This message has been delivered in Chat.  Depending on the other freegler's settings it may also be sent out by email soon - then this would turn into a little envelope.">
            <v-icon name="check" class="text-muted" />
          </span>
          <span v-if="chat.chattype === 'User2Mod' || chat.chattype === 'Mod2Mod'">
            <span v-if="chatmessage.userid === me.id">
              You
            </span>
            <span v-else-if="othermodname">
              {{ othermodname }}
            </span>
            <span v-else>
              <v-icon name="hashtag" class="text-muted" scale="0.5" />{{ chatmessage.userid }}
            </span>
            sent this
          </span>
          <span v-if="chatmessage.reviewrequired" class="text-danger small">
            Pending review
          </span>
          <span :title="datetimeshort(chatmessage.date)">{{ timeadapt(chatmessage.date) }}</span>
          <span v-if="mod && chatmessage.bymailid" class="btn btn-sm btn-white mb-2 clickme" :title="'Received by email #' + chatmessage.bymailid + ' click to view'" @click="viewOriginal">
            <v-icon name="info-circle" /> View original email
          </span>
          <b-badge v-if="chatmessage.replyexpected && !chatmessage.replyreceived" variant="info">
            RSVP - reply requested
          </b-badge>
        </span>
      </b-col>
      <ModMessageEmailModal v-if="showOriginal" :id="chatmessage.bymailid" ref="original" collection="Chat" />
    </b-row>
  </div>
</template>

<script>
import ChatBase from './ChatBase'
const ModMessageEmailModal = () => import('~/components/ModMessageEmailModal')

export default {
  components: {
    ModMessageEmailModal
  },
  extends: ChatBase,

  data: function() {
    return {
      showOriginal: false,
      dePlural: new RegExp(/^1 (.*)s/)
    }
  },
  computed: {
    othermodname() {
      return this.chatMessageUser ? this.chatMessageUser.displayname : null
    }
  },
  methods: {
    viewOriginal() {
      this.showOriginal = true
      this.waitForRef('original', () => {
        this.$refs.original.show()
      })
    }
  }
}
</script>

<style scoped>
.chat__dateread--theirs {
  padding-left: 30px;
}

.chat__dateread--mine {
  padding-right: 30px;
}
</style>
