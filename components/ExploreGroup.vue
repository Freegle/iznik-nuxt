<template>
  <div>
    <Message v-if="msgid" :id="msgid" record-view class="mb-2 mt-2" />

    <groupHeader v-if="group" :id="group.id" :key="'group-' + (group ? group.id : null)" :group="group" :show-join="true" />
    <div v-else>
      <b-card variant="default">
        <b-card-body class="p-0 mb-2">
          <p class="text-center text-muted">
            Offer stuff you don't need, or find stuff you want.
          </p>
          <b-row>
            <b-col cols="5">
              <b-button to="/give" class="mt-1" size="lg" block variant="primary">
                <client-only>
                  <v-icon name="gift" />
                </client-only>
                &nbsp;Give stuff
              </b-button>
            </b-col>
            <b-col cols="2" />
            <b-col cols="5">
              <b-button to="/find" class="mt-1" size="lg" block variant="secondary">
                <client-only>
                  <v-icon name="search" />
                </client-only>
                &nbsp;Ask for stuff
              </b-button>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </div>

    <div v-for="message in filteredMessages" :key="'message-' + message.id" class="p-0">
      <Message v-if="message.id != msgid" :id="message.id" record-view />
    </div>

    <client-only>
      <NoticeMessage v-if="!busy && !filteredMessages.length" variant="info" class="mt-2">
        There are no messages on this group yet.
      </NoticeMessage>
      <infinite-loading :distance="distance" @infinite="loadMoreMessages">
        <span slot="no-results" />
        <span slot="no-more" />
        <span slot="spinner">
          <b-img-lazy src="~/static/loader.gif" alt="Loading" />
        </span>
      </infinite-loading>
    </client-only>
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import NoticeMessage from './NoticeMessage'
const groupHeader = () => import('~/components/GroupHeader.vue')
const Message = () => import('~/components/Message.vue')

export default {
  components: {
    NoticeMessage,
    InfiniteLoading,
    groupHeader,
    Message
  },

  props: {
    id: {
      validator: prop => typeof prop === 'number' || typeof prop === 'string',
      required: true
    },
    msgid: {
      type: Number,
      required: false,
      default: null
    }
  },

  data: function() {
    return {
      busy: false,
      context: null,
      distance: 1000
    }
  },

  computed: {
    messages: function() {
      let messages

      if (this.group) {
        messages = this.$store.getters['messages/getByGroup'](this.group.id)
      } else {
        messages = this.$store.getters['messages/getAll']
      }

      return messages
    },

    filteredMessages() {
      return this.messages.filter(message => {
        return !message.outcomes || message.outcomes.length === 0
      })
    },

    group() {
      return this.$store.getters['group/get'](this.id)
    },

    closed() {
      let ret = false

      if (this.group && this.group.settings && this.group.settings.closed) {
        ret = true
      }

      return ret
    }
  },
  async mounted() {
    // asyncData in the parent has populated the store.
    //
    // If we are logged in then we might have restored a client-side store which doesn't include the messages in the
    // SSR of the page.  Trigger a re-fetch.
    if (this.me) {
      await this.$store.dispatch('messages/clear')
      await this.$store.dispatch('messages/clearContext')
    }

    if (this.msgid) {
      await this.$store.dispatch('messages/fetch', {
        id: this.msgid
      })
    }

    // We have the group id or name in this.id.  Fetch the group.
    const group = this.$store.getters['group/get'](this.id)

    if (!group || !group.membercount) {
      // Don't seem to have it all yet.
      this.$store.dispatch('group/fetch', {
        id: this.id
      })
    }

    this.context = this.$store.getters['messages/getContext']
  },

  methods: {
    loadMoreMessages: function($state) {
      this.busy = true

      let messages

      if (this.group) {
        messages = this.$store.getters['messages/getByGroup'](this.group.id)
      } else {
        messages = this.$store.getters['messages/getAll']
      }

      const lastCount = messages.length

      this.$store
        .dispatch('messages/fetchMessages', {
          groupid: this.group ? this.group.id : null,
          collection: 'Approved',
          summary: true,
          types: ['Offer', 'Wanted'],
          context: this.context
        })
        .then(() => {
          this.busy = false

          this.context = this.$store.getters['messages/getContext']

          if (this.group) {
            messages = this.$store.getters['messages/getByGroup'](this.group.id)
          } else {
            messages = this.$store.getters['messages/getAll']
          }

          if (messages.length === lastCount) {
            $state.complete()
          } else {
            $state.loaded()
          }
        })
        .catch(() => {
          $state.complete()
        })
    }
  }
}
</script>
