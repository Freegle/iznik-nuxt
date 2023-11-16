<template>
  <div>
    <div v-if="supportOrAdmin">
      <ModChatModal v-if="pov" :id="id" ref="modal" :pov="pov" />
    </div>
    <NoticeMessage v-else variant="warning">
      You don't have access to Support Tools.
    </NoticeMessage>
  </div>
</template>
<script>
import loginRequired from '@/mixins/loginRequired.js'
import ModChatModal from '@/components/ModChatModal'
import NoticeMessage from '~/components/NoticeMessage'

export default {
  components: {
    ModChatModal,
    NoticeMessage
  },
  mixins: [loginRequired],
  layout: 'modtools',
  data() {
    return {
      id: null,
      pov: null
    }
  },
  created() {
    this.id = parseInt(this.$route.params.id)
  },
  async mounted() {
    await this.$store.dispatch('messages/clear')
    await this.$store.dispatch('chats/clear')

    await this.$store.dispatch('chats/fetch', {
      id: this.id
    })

    await this.$store.dispatch('chatmessages/clearContext', {
      chatid: this.id
    })

    const chat = this.$store.getters['chats/get'](this.id)
    console.log('Got chat', chat)

    this.pov = chat.user1.id

    this.waitForRef('modal', () => {
      this.$refs.modal.show()
    })
  }
}
</script>
<style scoped>
.max {
  max-width: 300px;
}
</style>
