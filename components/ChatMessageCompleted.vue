<template>
  <div>
    <b-row class="pb-1">
      <b-col>
        <div v-if="chatmessage.userid != $store.state.auth.user.id" class="media">
          <b-card border-variant="info">
            <b-card-title>
              <b-img
                v-if="refmsg && refmsg.attachments && refmsg.attachments.length > 0"
                class="float-right"
                rounded
                thumbnail
                alt="Item photo"
                lazy
                :src="refmsg.attachments[0].paththumb"
                width="70px"
                @error.native="brokenImage"
              />
              <h4>
                {{ refmsg.subject }}
              </h4>
            </b-card-title>
            <b-card-text>
              <span v-if="refmsg.type === 'Offer'">
                This is no longer available.
              </span>
              <span v-else>
                They are no longer looking for this.
              </span>
            </b-card-text>
          </b-card>
        </div>
        <div v-else class="media float-right">
          <b-card border-variant="info">
            <b-card-title>
              <b-img
                v-if="refmsg && refmsg.attachments && refmsg.attachments.length > 0"
                class="float-right"
                rounded
                thumbnail
                alt="Item photo"
                lazy
                :src="refmsg.attachments[0].paththumb"
                width="70px"
                @error.native="brokenImage"
              />
              <h4>
                {{ refmsg.subject }}
              </h4>
            </b-card-title>
            <b-card-text>
              <v-icon name="info-circle" />
              <span v-if="refmsg.type === 'Offer'">
                We've let them know this is no longer available.
              </span>
              <span v-else>
                We've let them nknwo you are no longer looking for this.
              </span>
            </b-card-text>
          </b-card>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<style scoped>
.chatMessage {
  border: 1px solid lightgrey;
  border-radius: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 4px;
  padding-right: 2px;
  word-wrap: break-word;
  line-height: 1.75;
}
</style>
<script>
import twem from '~/assets/js/twem'

export default {
  props: {
    chat: {
      type: Object,
      required: true
    },
    chatmessage: {
      type: Object,
      required: true
    },
    me: {
      type: Object,
      required: true
    },
    otheruser: {
      type: Object,
      required: true
    }
  },
  computed: {
    emessage() {
      return twem.twem(this.$twemoji, this.chatmessage.message).trim()
    },
    refmsg() {
      return this.chatmessage.refmsg
        ? this.chatmessage.refmsg
        : {
            subject: 'A message which no longer exists'
          }
    }
  },
  methods: {
    brokenImage(event) {
      event.target.src = '/static/defaultprofile.png'
    }
  }
}
</script>
