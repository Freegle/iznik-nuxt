<template>
  <component
    :is="chatType"
    :class="{'text-white' : !isListItem}"
    href="#"
    aria-label="chats"
    @click="toChats"
  >
    <div class="position-relative small">
      <v-icon name="comments" scale="2" class="chat__icon" />
      <div class="nav-item__text d-none d-xl-block">
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
    isListItem: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  computed: {
    chatType() {
      // A different component needs to be created depending on the context in which it's used
      return this.isListItem ? 'b-nav-item' : 'a'
    },
    chatCount() {
      // Don't show so many that the layout breaks.
      return Math.min(99, this.$store.getters['chats/unseenCount'])
    }
  },
  watch: {
    chatCount: function() {
      this.$emit('update:chatCount', this.chatCount)
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

      const modtools = this.$store.getters['misc/get']('modtools')

      if (modtools) {
        this.$router.push('/modtools/chats')
      } else {
        this.$router.push('/chats')
      }
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
