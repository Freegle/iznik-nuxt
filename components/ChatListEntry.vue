<template>
  <div v-if="chat" class="clickme noselect" @click="click">
    <div class="ml-1 mr-1 d-flex justify-content-start">
      <div>
        <ProfileImage v-if="chat.icon" :image="chat.icon" class="mr-1 mb-1 mt-1 inline" is-thumbnail size="md" />
        <div v-if="chat.unseen" class="ml-2">
          <b-badge variant="danger">
            {{ chat.unseen }}
          </b-badge>
        </div>
      </div>
      <div>
        <!-- eslint-disable-next-line-->
        <span class="pl-0 mb-0 chatname truncate">{{ chat.name }}</span>
        <!-- eslint-disable-next-line-->
        <div class="small text-muted">{{ chat.lastdate | timeago }}</div>
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
import twem from '~/assets/js/twem'
import ProfileImage from '~/components/ProfileImage'

export default {
  components: {
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

    esnippet() {
      let ret = twem.twem(this.$twemoji, this.chat.snippet)

      // The way the snippet is constructed might lead to backslashes if we have an emoji.
      ret = ret.replace(/\\*$/, '') + '...'
      return ret
    }
  },

  methods: {
    click: function() {
      // We don't route to the new chat, because that causes the whole page to re-render, which is slow.
      this.$emit('click')
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
