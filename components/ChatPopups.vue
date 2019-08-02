<template>
  <div>
    <no-ssr>
      <b-list-group horizontal class="p-0 m-0 list-unstyled chatPopups">
        <b-list-group-item v-for="(chat, $index) in chatlist" :key="'popupchat-' + $index" class="bg-transparent">
          <ChatPopup :id="chat.id" />
        </b-list-group-item>
      </b-list-group>
    </no-ssr>
  </div>
</template>
<style>
.chatPopups {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 900;
}
</style>
<script>
import ChatPopup from '~/components/ChatPopup'

export default {
  components: {
    ChatPopup
  },
  props: {},
  data: function() {
    return {
      chats: []
    }
  },
  computed: {
    chatlist() {
      // The popup info is held in our local store.
      const popups = Object.values(this.$store.getters['popupchats/list']())

      // We want the chats which are currently set to be popups.
      const ret = []

      // There will be few popups, so although this involves a scan of all chats, the performance should be ok.
      for (const popup of popups) {
        for (const chat of this.chats) {
          if (parseInt(popup.id) === parseInt(chat.id)) {
            ret.push(chat)
            break
          }
        }
      }

      return ret
    }
  },
  async mounted() {
    // Components can't use asyncData, so we fetch here.  Can't do this for SSR, but that's fine as we don't
    // need to render this pane on the server.
    await this.$store.dispatch('chats/listChats')
    this.chats = Object.values(this.$store.getters['chats/list']())
  },
  methods: {}
}
</script>
