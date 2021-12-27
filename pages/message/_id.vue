<template>
  <b-col>
    <client-only v-if="me">
      <MicroVolunteering />
    </client-only>
    <b-row class="m-0">
      <b-col cols="0" xl="3" class="d-none d-xl-block" />
      <b-col cols="12" xl="6" class="p-0">
        <div v-if="error" class="bg-white p-2">
          <h1>Sorry, that message isn't around any more.</h1>
          <div>
            <p>If it was an OFFER, it's probably been TAKEN. If it was a WANTED, it's probably been RECEIVED.</p>
            <p>Why not look for something else?</p>
          </div>
          <b-row>
            <b-col cols="5" class="mt-1">
              <b-button to="/give" class="mt-1" size="lg" block variant="primary">
                <client-only><v-icon name="gift" /></client-only>&nbsp;Give stuff
              </b-button>
            </b-col>
            <b-col cols="2" />
            <b-col cols="5">
              <b-button to="/find" class="mt-1" size="lg" block variant="secondary">
                <client-only><v-icon name="shopping-cart" /></client-only>&nbsp;Ask for stuff
              </b-button>
            </b-col>
          </b-row>
        </div>
        <div v-else-if="myid && message && message.fromuser && message.fromuser.id === myid">
          <MyMessage
            :message="message"
            :show-old="true"
            expand
          />
        </div>
        <div v-else-if="message && (message.outcomes && message.outcomes.length > 0 || message.deleted || message.groups && message.groups.length && message.groups[0].collection === 'Rejected')">
          <h1>{{ message.subject }}</h1>
          <NoticeMessage variant="info">
            <p>Sorry, that message is no longer available.  Why not look for something else?</p>
          </NoticeMessage>
          <b-row>
            <b-col cols="5" class="mt-1">
              <b-button to="/give" class="mt-1" size="lg" block variant="primary">
                <client-only><v-icon name="gift" /></client-only>&nbsp;Give stuff
              </b-button>
            </b-col>
            <b-col cols="2" />
            <b-col cols="5">
              <b-button to="/find" class="mt-1" size="lg" block variant="secondary">
                <client-only><v-icon name="shopping-cart" /></client-only>&nbsp;Ask for stuff
              </b-button>
            </b-col>
          </b-row>
        </div>
        <div v-else>
          <GlobalWarning />
          <Message
            v-if="message"
            ref="message"
            v-bind="message"
            :start-expanded="true"
            hide-close
            class="botpad"
            record-view
            @view="recordView"
          />
        </div>
      </b-col>
      <b-col cols="0" xl="3" class="d-none d-xl-block" />
    </b-row>
  </b-col>
</template>
<script>
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
import NoticeMessage from '../../components/NoticeMessage'
import GlobalWarning from '../../components/GlobalWarning'
import MyMessage from '../../components/MyMessage'
import twem from '~/assets/js/twem'

const Message = () => import('~/components/Message.vue')
const MicroVolunteering = () => import('~/components/MicroVolunteering.vue')

export default {
  components: {
    MicroVolunteering,
    MyMessage,
    GlobalWarning,
    NoticeMessage,
    Message
  },
  mixins: [loginOptional, buildHead],
  data: function() {
    return {
      id: null,
      message: null
    }
  },
  computed: {},
  watch: {
    options(newVal, oldVal) {
      if (this.filterByAnchor) {
        const { type, anchor } = this
        const regex = new RegExp(`${type}`, 'i')
        const filtered = newVal.filter(item => {
          const found = item[anchor].search(regex) !== -1
          return found
        })
        this.json = filtered
      } else {
        this.json = newVal
      }
    }
  },
  async asyncData({ app, params, store }) {
    if (params.id) {
      try {
        await store.dispatch('messages/fetch', {
          id: params.id
        })

        const message = store.getters['messages/get'](params.id)

        return {
          message: message,
          error: !message || !message.id
        }
      } catch (e) {
        return {
          message: null,
          error: true
        }
      }
    } else {
      // No supplied id.  The default error will do.
      return {
        message: null,
        error: true
      }
    }
  },
  created() {
    this.id = this.$route.params.id
  },
  head() {
    // The code here has to match singlemessage.php on the server for consistency.
    let snip = null
    const message = this.message

    if (message) {
      if (message.snippet) {
        snip = twem.twem(this.$emoji, message.snippet) + '...'
      } else {
        snip = 'Click for more details'
      }

      return this.buildHead(
        message.subject,
        snip,
        message.attachments && message.attachments.length > 0
          ? message.attachments[0].path
          : null
      )
    }
  },
  async mounted() {
    if (this.id) {
      if (process.browser && (!this.message || !this.message.fromuser)) {
        // We are on the client and loading a page which we have rendered on the server rather than navigated to on the
        // client side.  We will therefore have rendered it logged out.  Refetch the message so that we get more info,
        // which we may do when logged in.
        await this.$store.dispatch('messages/fetch', {
          id: this.id
        })

        this.message = this.$store.getters['messages/get'](this.id)
      }
    }
  },
  methods: {
    recordView() {
      // TODO Remove after 2022-03-01
      if (this.trackViews && !this.trackedView) {
        this.trackedView = true

        this.$api.bandit.chosen({
          uid: 'messageview',
          variant: 'single'
        })
      }
    }
  }
}
</script>
<style scoped>
/*On Firefox mobile there's a bug where the URL bar covers the bottom of the page.*/
.botpad {
  margin-bottom: 4rem;
}
</style>
