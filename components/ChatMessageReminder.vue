<template>
  <div>
    <b-row>
      <b-col>
        <div class="media">
          <b-card border-variant="success" :class="{ 'ml-auto': !amUser } ">
            <b-card-title>
              <h4>
                <span class="align-middle"> Reminder:</span>
              </h4>
            </b-card-title>
            <b-card-text>
              <div :class="emessage ? 'media-body chatMessage' : 'media-body'">
                <span>
                  <span v-if="(chatmessage.secondsago < 60) || (chatmessage.id > chat.lastmsgseen)" class="prewrap font-weight-bold">{{ emessage }}</span>
                  <span v-else class="preline forcebreak">{{ emessage }}</span>
                </span>
              </div>
              <div class="text-muted small">
                This is an automated message.
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

export default {
  extends: ChatBase,
  computed: {
    amUser() {
      return this.chat && this.chat.user && this.chat.user.id === this.myid
    }
  }
}
</script>
