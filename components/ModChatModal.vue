<template>
  <div>
    <b-modal
      :id="'messageReportModal-' + id"
      v-model="showModal"
      size="lg"
      no-stacking
    >
      <template slot="modal-title" class="w-100">
        <div class="d-flex justify-content-between">
          <div v-if="user1">
            {{ user1.displayname }}
            <span class="text-muted small">
              <v-icon name="hashtag" class="text-muted" scale="0.8" />{{ user1.id }}
            </span>
          </div>
          <div v-if="user2">
            {{ user2.displayname }}
            <span class="text-muted small">
              <v-icon name="hashtag" class="text-muted" scale="0.8" />{{ user2.id }}
            </span>
          </div>
        </div>
      </template>
      <template slot="default">
        <div v-if="chat" ref="chatContent" class="m-0 chatContent" infinite-wrapper>
          <infinite-loading direction="top" force-use-infinite-wrapper="true" :distance="distance" @infinite="loadMore">
            <span slot="no-results" />
            <span slot="no-more" />
            <span slot="spinner">
              <b-img-lazy src="~/static/loader.gif" alt="Loading" />
            </span>
          </infinite-loading>
          <ul v-for="chatmessage in chatmessages" :key="'chatmessage-' + chatmessage.id" class="p-0 pt-1 list-unstyled mb-1">
            <li v-if="chatmessage">
              <ChatMessage
                :key="'chatmessage-' + chatmessage.id"
                :chatmessage="chatmessage"
                :chat="chat"
                :otheruser="chat.user1.id === chatmessage.userid ? chat.user2 : chat.user1"
                :last="chatmessage.id === chatmessages[chatmessages.length - 1].id"
              />
            </li>
          </ul>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="white" @click="cancel">
          Close
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import ChatMessage from './ChatMessage'
import chatCollate from '@/mixins/chatCollate.js'

export default {
  components: { ChatMessage, InfiniteLoading },
  mixins: [chatCollate],
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      showModal: false,
      busy: true,
      complete: false,
      distance: 1000,
      chat: null,
      scrolledToBottom: false
    }
  },
  computed: {
    user1() {
      return this.chat ? this.chat.user1 : null
    },
    user2() {
      return this.chat ? this.chat.user2 : null
    },
    chatmessages() {
      return this.chatCollate(
        this.$store.getters['chatmessages/getMessages'](this.id)
      )
    }
  },
  methods: {
    async show() {
      await this.$store.dispatch('chats/fetch', {
        id: this.id
      })

      // Take a copy rather than use computed as it isn't ours and will vanish from the store.
      this.chat = this.$store.getters['chats/get'](this.id)

      this.showModal = true
    },
    hide() {
      this.showModal = false
    },
    loadMore: function($state) {
      const currentCount = this.chatmessages.length

      if (this.complete) {
        $state.complete()
      } else {
        this.busy = true
        this.$store
          .dispatch('chatmessages/fetch', {
            chatid: this.id
          })
          .then(() => {
            if (!this.scrolledToBottom) {
              // First load.  Scroll to the bottom when things have sorted themselves out.
              this.$nextTick(() => {
                if (this.$el && this.$el.querySelector) {
                  const container = this.$refs.chatContent
                  if (container) {
                    container.scrollTop = container.scrollHeight
                    this.scrolledToBottom = true
                  }
                }
              })
            }

            try {
              if (currentCount === this.chatmessages.length) {
                $state.complete()
              } else {
                $state.loaded()
              }
              this.busy = false
            } catch (e) {
              console.error(e)
            }
          })
          .catch(e => {
            console.error(e)
            this.busy = false
            $state.complete()
          })
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

::v-deep h5 {
  width: 100%;
}

.chatContent {
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: 75vh;
  background-color: $color-yellow--light;
}
</style>
