<template>
  <div>
    <b-row class="pb-1">
      <b-col>
        <div class="media">
          <b-card border-variant="success">
            <b-card-title>
              <div v-if="group">
                <h4>
                  <b-img-lazy
                    v-if="group"
                    rounded="circle"
                    thumbnail
                    class="profilesm p-0 mb-1 inline mr-1 mt-1"
                    alt="Profile picture"
                    title="Profile"
                    :src="group.profile"
                    @error.native="brokenImage"
                  />
                  <span class="align-middle">
                    Message from {{ group.namedisplay }} Volunteers
                  </span>
                </h4>
              </div>
            </b-card-title>
            <b-card-text>
              <div :class="emessage ? 'media-body chatMessage' : 'media-body'">
                <span>
                  <span v-if="(chatmessage.secondsago < 60) || (chatmessage.id > chat.lastmsgseen)" class="prewrap"><b>{{ emessage }}</b></span>
                  <span v-else class="prewrap forcebreak">{{ emessage }}</span>
                  <b-img v-if="chatmessage.image" fluid :src="chatmessage.image.path" lazy rounded />
                </span>
              </div>
              <hr>
              <p>If you have been asked to edit and resend this message, you can do so here:</p>
              <b-btn variant="warning" @click="repost">
                <v-icon name="pen" /> Edit and Resend
              </b-btn>
            </b-card-text>
          </b-card>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<style scoped>
</style>
<script>
import 'vue-awesome/icons/pen'

  // TODO MINOR If we included more info from the server about the type of ModMail then we could decide more intelligently
// whether or not to show the Edit button.
import ChatBase from '~/components/ChatBase'

export default {
  extends: ChatBase,
  computed: {
    group() {
      return this.chat && this.chat.group ? this.chat.group : null
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
