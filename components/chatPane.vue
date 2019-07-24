<template>
  <no-ssr>
    <div>
      <div v-if="chat">
        <ul v-for="(chatmessage, $index) in chat.chatmessages" :key="'chatmessage-' + $index" class="p-0 list-unstyled mb-1">
          <li>
            {{ chatmessage.message }}
          </li>
        </ul>
      </div>
    </div>
  </no-ssr>
</template>
<script>
export default {
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      chat: null
    }
  },
  async mounted() {
    // Components can't use asyncData, so we fetch here.  Can't do this for SSR, but that's fine as we don't
    // need to render this pane on the server.
    console.log('Fetch chat', {
      id: this.id
    })
    await this.$store.dispatch('chats/fetch', {
      id: this.id
    })

    const chat = this.$store.getters['chats/get'](this.id)
    console.log('Got chat', chat)
    this.chat = chat
  }
}
</script>
