<template>
  <b-btn :size="size" :variant="variant" class="mt-2 mb-2" @click="openChat">
    <v-icon name="comments" />
    <span v-if="title">
      {{ title }}
    </span>
  </b-btn>
</template>
<script>
export default {
  props: {
    size: {
      type: String,
      required: false,
      default: null
    },
    title: {
      type: String,
      required: false,
      default: null
    },
    variant: {
      type: String,
      required: false,
      default: 'white'
    },
    groupid: {
      type: Number,
      required: false,
      default: null
    },
    userid: {
      type: Number,
      required: false,
      default: null
    }
  },
  methods: {
    async openChat() {
      console.log('Click', this.groupid)
      if (this.groupid > 0) {
        // Open a chat to the mods
        const chatid = await this.$store.dispatch('chats/openChatToMods', {
          groupid: this.groupid
        })

        await this.$store.dispatch('popupchats/popup', {
          id: chatid
        })
      }
    }
  }
}
</script>
