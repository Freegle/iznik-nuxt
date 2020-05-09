<template>
  <div>
    <b-row class="pb-1">
      <b-col>
        <div class="media">
          <b-card border-variant="success" :class="{ 'ml-auto': !amUser } ">
            <b-card-title>
              <div v-if="group">
                <h4>
                  <ProfileImage v-if="group" :image="group.profile" class="mr-1 mb-1 mt-1 inline" is-thumbnail size="sm" />
                  <span class="align-middle">
                    Message from {{ group.namedisplay }} Volunteers
                  </span>
                </h4>
              </div>
              <h4 v-else>
                Message from Freegle Volunteers
              </h4>
            </b-card-title>
            <b-card-text>
              <div :class="emessage ? 'media-body chatMessage' : 'media-body'">
                <span>
                  <span v-if="(chatmessage.secondsago < 60) || (chatmessage.id > chat.lastmsgseen)" class="prewrap"><b>{{ emessage }}</b></span>
                  <span v-else class="preline forcebreak">{{ emessage }}</span>
                  <b-img v-if="chatmessage.image" fluid :src="chatmessage.image.path" lazy rounded />
                </span>
              </div>
              <div v-if="chatmessage.refmsgid">
                <hr>
                {{ chatmessage.refmsg }}
                <p>If you have been asked to edit and resend this message, you can do so here:</p>
                <b-btn variant="warning" @click="repost">
                  <v-icon name="pen" /> Edit and Resend
                </b-btn>
              </div>
            </b-card-text>
          </b-card>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import ChatBase from '~/components/ChatBase'
import ProfileImage from '~/components/ProfileImage'

export default {
  components: {
    ProfileImage
  },
  extends: ChatBase,
  computed: {
    group() {
      return this.chat && this.chat.group ? this.chat.group : null
    },
    amUser() {
      console.log('amUSer', this.chat)
      return this.chat && this.chat.user && this.chat.user.id === this.myid
    }
  },
  methods: {
    async repost() {
      // Get the full message - we don't have the body.
      await this.$store.dispatch('messages/fetch', {
        id: this.chatmessage.refmsg.id
      })

      const message = this.$store.getters['messages/get'](
        this.chatmessage.refmsg.id
      )

      // Add this message to the compose store so that it will show up on the compose page.
      console.log('Repost', message)

      await this.$store.dispatch('compose/setMessage', {
        id: message.id,
        type: message.type,
        item: message.item.name.trim(),
        description: message.textbody.trim()
      })

      await this.$store.dispatch('compose/setAttachmentsForMessage', {
        id: message.id,
        attachments: message.attachments
      })

      this.$router.push(
        message.type === 'Offer' ? '/give/whatisit' : 'find/whatisit'
      )
    }
  }
}
</script>

<style scoped>
</style>
