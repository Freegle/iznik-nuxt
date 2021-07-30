<template>
  <div v-if="chat" class="clickme noselect" @click="click">
    <div class="ml-1 mr-1 d-flex justify-content-start w-100">
      <div>
        <ProfileImage v-if="chat.icon" :image="chat.icon" class="mr-1 mb-1 mt-1 inline" is-thumbnail size="md" />
        <div v-if="chat.unseen" class="ml-2">
          <b-badge variant="danger">
            {{ chat.unseen }}
          </b-badge>
        </div>
      </div>
      <div class="w-100">
        <!-- eslint-disable-next-line-->
        <span class="pl-0 mb-0 chatname truncate d-flex justify-content-between">{{ chat.name }} <Supporter v-if="supporter" class="mr-3 mt-1 small" /></span>
        <!-- eslint-disable-next-line-->
        <div class="small text-muted" :title="dateFormatted">{{ chat.lastdate | timeago }}</div>
        <div>
          <b-badge v-if="chat.replyexpected" variant="danger">
            RSVP - please reply
          </b-badge>
          <!-- eslint-disable-next-line-->
          <div v-else-if="chat.snippet && chat.snippet !== 'false'" class="truncate">{{ esnippet }}</div>
          <div v-else>
            ...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Supporter from '~/components/Supporter'
import twem from '~/assets/js/twem'
import ProfileImage from '~/components/ProfileImage'

export default {
  components: {
    Supporter,
    ProfileImage
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },

  computed: {
    chat() {
      return this.$store.getters['chats/get'](this.id)
    },
    dateFormatted() {
      if (this.chat) {
        return this.$dayjs(this.chat.lastdate).format('Do MMMM, YYYY HH:mm:ss')
      }

      return null
    },
    esnippet() {
      if (this.chat.snippet === 'null') {
        return '...'
      }

      let ret = twem.twem(this.$twemoji, this.chat.snippet)
      // The way the snippet is constructed might lead to backslashes if we have an emoji.
      ret = ret.replace(/\\*$/, '') + '...'
      return ret
    },
    supporter() {
      // In the summary case, the chat has the supporter flag in it.  If we have fetched the chat, we have to
      // look at the user.
      if (this.chat) {
        if (this.chat.supporter) {
          return true
        }

        if (
          typeof this.chat.user1 === 'object' &&
          typeof this.chat.user2 === 'object'
        ) {
          if (this.chat.user1.id !== this.myid) {
            return this.chat.user1.supporter
          } else {
            return this.chat.user2.supporter
          }
        }
      }

      return false
    }
  },

  methods: {
    click: function() {
      // We need to do a full route otherwise the back button doesn't work.
      const modtools = this.$store.getters['misc/get']('modtools')
      this.$router.push((modtools ? '/modtools/chats/' : '/chats/') + this.id)
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.chatname {
  color: $colour-info-fg;
  font-weight: bold;
  white-space: nowrap;
}
</style>
