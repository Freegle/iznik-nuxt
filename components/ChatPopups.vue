<template>
  <div>
    <client-only>
      <b-list-group horizontal class="p-0 m-0 list-unstyled chatPopups">
        <b-list-group-item v-for="chat in chatlist" :key="'popupchat-' + chat.id" class="bg-transparent">
          <ChatPopup :id="chat.id" />
        </b-list-group-item>
      </b-list-group>
    </client-only>
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
const ChatPopup = () => import('~/components/ChatPopup')

export default {
  components: {
    ChatPopup
  },
  props: {},
  data: function() {
    return {}
  },
  computed: {
    chatlist() {
      // The popup info is held in our local store.
      const popups = Object.values(this.$store.getters['popupchats/list'])

      // We want the chats which are currently set to be popups.
      const ret = []

      const chats = Object.values(this.$store.getters['chats/list'])

      // There will be few popups, so although this involves a scan of all chats, the performance should be ok.
      for (const popup of popups) {
        for (const chat of chats) {
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
    // need to render this on the server.
    const modtools = this.$store.getters['misc/get']('modtools')
    await this.$store.dispatch('chats/listChats', {
      chattypes: modtools ? ['User2Mod', 'Mod2Mod'] : ['User2User', 'User2Mod']
    })
  },
  methods: {}
}
</script>
