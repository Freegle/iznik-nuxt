<template>
  <b-container fluid>
    <b-row class="m-0">
      <b-col cols="12" lg="6" offset-lg="3" class="p-0">
        <div v-if="!message && !missing" class="text-center">
          <b-img-lazy src="~/static/loader.gif" alt="Loading" />
        </div>
        <div v-if="message">
          <MyMessage
            v-if="message.fromuser && me && message.fromuser === me.id"
            :key="bump"
            :message="message"
            :messages="[ message ]"
            :show-old="true"
            :expand="true"
            :action="action"
          />
          <b-alert variant="warning" class="mt-2" show>
            <h3>That message wasn't sent from your account</h3>
            <h5>{{ message.subject }}</h5>
            <p>
              This can happen if you have two different accounts on Freegle - e.g. if you use Google
              to log in some of the time, and an email/password at other times.
            </p>
            <p>
              Your local volunteers can merge your accounts or help you work out what's going on.  Please quote
              message <b>#{{ message.id }}</b>, your email address <b>{{ me.email }}</b> and any others you might have
              used, and which email address you prefer.
            </p>
            <GroupSelect v-model="contactGroup" class="mt-2 mb-1" />
            <br>
            <ChatButton :groupid="contactGroup" size="lg" title="Contact community volunteers" variant="success" class="mb-2" />
            <p class="mt-2">
              ...or if you need to, you can contact our national support volunteers at <a href="mailto:support@ilovefreegle.org">support@ilovefreegle.org</a>.
            </p>
          </b-alert>
        </div>
        <div v-if="missing">
          <NoticeMessage variant="danger" class="mt-1">
            Sorry, we couldn't find that message.  Perhaps it's been deleted, or perhaps the link you clicked on is
            wrong?
          </NoticeMessage>
          <div class="text-center">
            <b-btn variant="white" size="lg" class="mt-2" to="/myposts">
              Go to My Posts <v-icon name="angle-double-right" />
            </b-btn>
          </div>
        </div>
      </b-col>
    </b-row>
    <DonationAskModal ref="askmodal" :groupid="donationGroup" />
  </b-container>
</template>
<script>
import NoticeMessage from '../../../components/NoticeMessage'
import ChatButton from '../../../components/ChatButton'
import GroupSelect from '../../../components/GroupSelect'
import loginRequired from '@/mixins/loginRequired.js'
import buildHead from '@/mixins/buildHead.js'
const MyMessage = () => import('~/components/MyMessage.vue')
const DonationAskModal = () => import('~/components/DonationAskModal')

export default {
  components: {
    GroupSelect,
    ChatButton,
    NoticeMessage,
    MyMessage,
    DonationAskModal
  },
  mixins: [loginRequired, buildHead],
  data() {
    return {
      donationGroup: null,
      contactGroup: null,
      missing: false,
      bump: Date.now()
    }
  },
  computed: {
    me() {
      return this.$store.getters['auth/user']
    },

    message() {
      return this.$store.getters['messages/get'](this.id)
    }
  },
  watch: {
    async me(newVal, oldVal) {
      if (newVal) {
        if (!oldVal) {
          // We have logged in. Fetch the message again because we won't have our details.
          await this.$store.dispatch('messages/fetch', {
            id: this.id
          })

          this.setGroup()

          // Force re-render of the message, which will trigger any action we have.
          this.bump = Date.now()
        }
      }
    }
  },
  beforeCreate() {
    this.id = this.$route.params.id
    this.action = this.$route.params.action
  },
  async mounted() {
    try {
      await this.$store.dispatch('messages/fetch', {
        id: this.id
      })

      this.setGroup()

      this.bump = Date.now()

      // If they have an intended outcome, then we save that to the server now.  This means that if they never
      // get round to doing anything else on this page we'll assume that's what they wanted.  We do this because
      // we've seen people click the button in the email a lot and then bail out.
      const me = this.$store.getters['auth/user']

      if (this.action && me) {
        let outcome = null

        if (this.action === 'repost') {
          outcome = 'Repost'
        } else if (this.action === 'withdraw') {
          outcome = 'Withdrawn'
        } else if (this.action === 'completed') {
          outcome = this.message.type === 'Offer' ? 'Taken' : 'Received'
        }

        if (outcome) {
          this.$store.dispatch('messages/intend', {
            id: this.id,
            outcome: outcome
          })
        }
      }

      // Fetch the chats.  We need this so that we can find chats with unread messages which relate to our own posts
      await this.$store.dispatch('chats/listChats')

      // For some reason we can't capture emitted events from the outcome modal so use root as a bus.
      this.$root.$on('outcome', groupid => {
        this.donationGroup = groupid
        this.ask()
      })
    } catch (e) {
      // We couldn't fetch that message.  Probably deleted.
      this.missing = true
    }
  },
  methods: {
    ask(groupid) {
      if (this.$refs.askmodal) {
        this.$refs.askmodal.show()
      } else {
        // This would be a bug.  We've seen it during dev and so we have the if test to prevent client-visible errors.
        console.error("Don't ask for donation, no ref")
      }
    },

    setGroup() {
      if (this.message && this.message.groups && this.message.groups.length) {
        this.contactGroup = this.message.groups[0].id
      }
    }
  },
  head() {
    return this.buildHead(
      'My Posts',
      "See OFFERs/WANTEDs that you've posted, and replies to them."
    )
  }
}
</script>
