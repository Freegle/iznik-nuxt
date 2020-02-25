<template>
  <div>
    <b-row class="m-0">
      <b-col cols="12" lg="6" offset-lg="3">
        <groupHeader v-if="group" :id="group.id" :key="'group-' + (group ? group.id : null)" :group="group" :show-join="true" />
        <b-card variant="default">
          <b-card-body class="p-0 mb-2">
            <p class="text-center text-muted">
              Offer stuff you don't need, or find stuff you want.
            </p>
            <b-row>
              <b-col cols="5">
                <b-button to="/give" class="mt-1" size="lg" block variant="success">
                  <v-icon name="gift" />&nbsp;Give stuff
                </b-button>
              </b-col>
              <b-col cols="2" />
              <b-col cols="5">
                <b-button to="/find" class="mt-1" size="lg" block variant="primary">
                  <v-icon name="search" />&nbsp;Find stuff
                </b-button>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>

        <div v-for="message in filteredMessages" :key="'message-' + message.id" class="p-0">
          <Message v-bind="message" />
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
      </b-col>
    </b-row>
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
    }
  },

  data: function() {
    return {
      group: null,
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
    }
  },

  mounted() {
    // asyncData in the parent has populated the store.
    // We have the group id or name in this.id.  Fetch the group.
    this.group = this.$store.getters['group/get'](this.id)
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
