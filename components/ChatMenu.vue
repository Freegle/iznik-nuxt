<template>
  <component
    :is="chatType"
    :id="smallScreen ? 'menu-option-chat-sm' : 'menu-option-chat'"
    :class="smallScreen ? 'text-white mr-3 position-relative' : 'text-center small p-0'"
    href="#"
    aria-label="chats"
    @click="toChats"
  >
    <div class="position-relative">
      <v-icon name="comments" scale="2" class="chat__icon" />
      <div v-if="!smallScreen" class="nav-item__text">
        Chats
      </div>
      <b-badge v-if="chatCount" variant="danger" class="chatbadge">
        {{ chatCount }}
      </b-badge>
    </div>
  </component>
</template>

<script>
export default {
  name: 'ChatMenu',
  props: {
    smallScreen: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    chatType() {
      return this.smallScreen ? 'a' : 'b-nav-item'
    },
    chatCount() {
      // Don't show so many that the layout breaks.
      return Math.min(99, this.$store.getters['chats/unseenCount'])
    }
  },
  watch: {
    chatCount: function() {
      this.$emit('chat-count', this.chatCount)
    }
  },
  methods: {
    toChats(e) {
      if (e) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
      }

      // Ensure we have no chat selected.  On mobile this will force us to show the chat list.
      this.$store.dispatch('chats/currentChat', {
        chatid: null
      })

      this.$router.push('/chats')
    }
  }
}
</script>

<style scoped lang="scss">
.chatbadge {
  position: absolute;
  top: 0px;
  left: 25px;
}

.chat__icon {
  height: 32px;
  margin: 0;
}
</style>
