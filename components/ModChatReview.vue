<template>
  <div>
    <b-card no-body>
      <b-card-header>
        <div class="d-flex justify-content-between flex-wrap">
          <div class="d-flex justify-content-start flex-wrap">
            <ModChatReviewUser :user="message.fromuser" class="mr-2" tag="From: " :groupid="message.group.id" />
            <v-icon name="arrow-circle-right" scale="2" class="mt-1 text-info" />
            <ModChatReviewUser :user="message.touser" class="ml-2" tag="To: " :groupid="message.group.id" />
          </div>
          <b-btn v-if="message.bymailid" size="lg" variant="white" @click="viewOriginal">
            <v-icon name="info-circle" /> View original email
          </b-btn>
        </div>
      </b-card-header>
      <b-card-body>
        <NoticeMessage v-if="message.reviewreason" class="mb-2">
          This is here because: {{ reviewreason }}
        </NoticeMessage>
        <NoticeMessage v-if="message.held" class="mb-2" variant="warning">
          <span v-if="me.id === message.held.id">
            You held this {{ timeago(message.held.timestamp) }}.  Other can't release it or act on it.
          </span>
          <span v-else>
            Held by <strong><ExternalLink :href="'mailto:' + message.held.email">{{ message.held.name }}</ExternalLink></strong>
            {{ timeago(message.held.timestamp) }}.  Please check with them if you think it should be released.
          </span>
        </NoticeMessage>
        <div class="rounded bg-white p-2 font-weight-bold border border-warning mb-2">
          <ChatMessage
            :chat="message.chatroom"
            :chatmessage="message"
            :otheruser="message.fromuser"
            last
            :chatusers="chatusers"
            highlight-emails
          />
        </div>
        <ModSpammer v-if="message.touser.spammer" :user="message.touser" />
        <div class="d-flex justify-content-between flex-wrap">
          <span>
            {{ timeago(message.date) }}
          </span>
          <span v-if="message.widerchatreview" class="text-danger">
            <v-icon name="info-circle" />
            <em>Quicker Chat Review</em>
          </span>
          <span>
            <v-icon name="info-circle" /> {{ message.touser.displayname }} is on {{ message.group.namedisplay }}
            <span v-if="!message.widerchatreview">, which you mod.
              <b-btn :to="'/modtools/members/approved/search/' + message.group.id + '/' + message.touser.id" variant="link" class="p-0 border-0 align-top">
                Go to membership
              </b-btn>
            </span>
          </span>
          <span>
            <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ message.id }}
          </span>
        </div>
        <ModSpammer v-if="message.fromuser.spammer" :user="message.fromuser" />
        <div class="d-flex justify-content-around">
          <div>
            <span>
              <!-- eslint-disable-next-line -->
            <v-icon name="info-circle" /> {{ message.fromuser.displayname }} is <span v-if="message.groupfrom">on {{ message.groupfrom.namedisplay }}
                <span v-if="!message.widerchatreview">
                  <span v-if="message.groupfrom">, which you mod</span><span v-else>not on any groups which you actively mod.</span>
                  <b-btn v-if="message.groupfrom" :to="'/modtools/members/approved/search/' + message.groupfrom.id + '/' + message.fromuser.id" variant="link" class="p-0 border-0 align-top">
                    Go to membership
                  </b-btn>
                </span>
              </span>
            </span>
          </div>
        </div>
      </b-card-body>
      <b-card-footer>
        <div class="d-flex flex-wrap justify-content-start">
          <template v-if="!message.widerchatreview">
            <ModChatViewButton
              :id="message.chatid"
              :pov="message.touser.id"
            />
            <b-btn
              v-if="message.held && me.id === message.held.id"
              variant="warning"
              class="mr-2 mb-1"
              @click="release"
            >
              <v-icon name="play" /> Release
            </b-btn>
            <SpinButton
              v-if="!message.held"
              name="exclamation-triangle"
              label="Add Mod Message"
              variant="warning"
              class="mr-2 mb-1"
              :handler="modnote"
            />
            <SpinButton
              v-if="!message.held"
              name="eraser"
              label="Remove highlighted emails"
              variant="warning"
              class="mr-2 mb-1"
              :handler="redactEmails"
            />
          </template>
          <SpinButton
            v-if="!message.held"
            name="check"
            label="Approve - Not Spam"
            spinclass="text-white"
            variant="primary"
            class="mr-2 mb-1"
            :handler="approve"
          />
          <template v-if="!message.widerchatreview">
            <SpinButton
              v-if="!message.held"
              name="check"
              label="Approve and whitelist"
              spinclass="text-white"
              variant="primary"
              class="mr-2 mb-1"
              confirm
              :handler="whitelist"
            />
            <SpinButton
              v-if="!message.held"
              name="pause"
              label="Hold"
              variant="warning"
              class="mr-2 mb-1"
              :handler="hold"
            />
            <SpinButton
              v-if="!message.held"
              name="trash-alt"
              label="Delete"
              variant="danger"
              class="mr-2 mb-1"
              confirm
              :handler="reject"
            />
            <SpinButton
              v-if="!message.held"
              name="ban"
              label="Spam"
              variant="danger"
              class="mr-2 mb-1"
              confirm
              :handler="reject"
            />
          </template>
        </div>
      </b-card-footer>
    </b-card>
    <ModChatNoteModal v-if="message" ref="modnote" :chatid="message.chatid" />
    <ModMessageEmailModal v-if="showOriginal" :id="message.bymailid" ref="original" />
  </div>
</template>
<script>
import chat from '@/mixins/chat.js'
import NoticeMessage from './NoticeMessage'
import ModChatReviewUser from './ModChatReviewUser'
import ChatMessage from './ChatMessage'
import ModChatNoteModal from './ModChatNoteModal'
import ModChatViewButton from './ModChatViewButton'
import SpinButton from './SpinButton'

const ModMessageEmailModal = () => import('~/components/ModMessageEmailModal')
const ExternalLink = () => import('~/components/ExternalLink')
const ModSpammer = () => import('~/components/ModSpammer')

export default {
  components: {
    SpinButton,
    ModChatViewButton,
    ModChatNoteModal,
    ChatMessage,
    ModChatReviewUser,
    NoticeMessage,
    ModMessageEmailModal,
    ExternalLink,
    ModSpammer
  },
  mixins: [chat],
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      showOriginal: false
    }
  },
  computed: {
    reviewreason() {
      let ret = null

      if (this.message && this.message.reviewreason) {
        switch (this.message.reviewreason) {
          case 'Last': {
            ret = 'Earlier message is held for review, so this one is too.'
            break
          }
          case 'Force': {
            ret = 'Possible spam.'
            break
          }
          case 'Fully': {
            ret = 'This member is set to have all chat messages reviewed.'
            break
          }
          case 'TooMany': {
            ret =
              'This member has sent a lot of chat messages recently, which can indicate scammers/spammers.'
            break
          }
          case 'User': {
            ret =
              'The member was been flagged for review, so this message was flagged too.  Please check the member logs for more info.'
            break
          }
          case 'UnknownMessage': {
            ret =
              'This is a reply to a post we cannot find.  Sometimes that is a spammer using old data.'
            break
          }
          case 'Spam': {
            ret =
              "This message failed spam checks, but we don't have any more information about why."
            break
          }
          case 'CountryBlocked': {
            ret = 'It comes from a country we are blocking.'
            break
          }
          case 'IPUsedForDifferentUsers': {
            ret =
              'The same IP address has been used for a lot of different users.'
            break
          }
          case 'IPUsedForDifferentGroups': {
            ret =
              ' The same IP address has been used for a lot of different groups.'
            break
          }
          case 'SubjectUsedForDifferentGroups': {
            ret =
              'The same subject line has been used on a lot of different groups.'
            break
          }
          case 'SpamAssassin': {
            ret = 'The SpamAssassin filter thinks it might be spam.'
            break
          }
          case 'Greetings spam': {
            ret = 'It looks like a particular kind of greetings spam.'
            break
          }
          case 'Referenced known spammer': {
            ret = 'It refers to a known spammer.'
            break
          }
          case 'Known spam keyword': {
            ret = 'It uses a known spam keyword.'
            break
          }
          case 'URL on DBL': {
            ret = 'It refers to a suspicious website.'
            break
          }
          case 'BulkVolunteerMail': {
            ret = 'They have mailed many volunteer@ emails.'
            break
          }
          case 'UsedOurDomain': {
            ret = 'They have used our web domain in a suspicious way.'
            break
          }
          case 'WorryWord': {
            ret = 'It uses a known Worry Word.'
            break
          }
          case 'Script': {
            ret = 'It contains a suspicious <script> tag.'
            break
          }
          case 'Link': {
            ret = 'It contains a link.'
            break
          }
          case 'Money': {
            ret = 'It looks like it refers to money.'
            break
          }
          case 'Email': {
            ret = 'It contains an email address.'
            break
          }
          case 'Language': {
            ret =
              'It might not be in English, so needs checking via Google Translate.'
            break
          }
          case 'SameImage': {
            ret =
              'Same image sent many times recently, which sometimes indicates spam.'
            break
          }
          default: {
            ret = this.message.reviewreason
          }
        }
      }

      return ret
    }
  },
  methods: {
    async release() {
      await this.$store.dispatch('chatmessages/release', {
        id: this.message.id,
        chatid: null
      })
    },
    async hold() {
      await this.$store.dispatch('chatmessages/hold', {
        id: this.message.id,
        chatid: null
      })
    },
    async approve() {
      await this.$store.dispatch('chatmessages/approve', {
        id: this.message.id,
        chatid: null
      })
    },
    async reject() {
      await this.$store.dispatch('chatmessages/reject', {
        id: this.message.id,
        chatid: null
      })
    },
    async whitelist() {
      await this.$store.dispatch('chatmessages/whitelist', {
        id: this.message.id,
        chatid: null
      })
    },
    modnote() {
      this.waitForRef('modnote', () => {
        this.$refs.modnote.show()
      })
    },
    async redactEmails() {
      await this.$store.dispatch('chatmessages/redact', {
        id: this.message.id,
        chatid: null
      })
    },
    viewOriginal() {
      this.showOriginal = true
      this.waitForRef('original', () => {
        this.$refs.original.show()
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.highlight {
  color: $color-blue--base;
  background-color: initial;
}
</style>
