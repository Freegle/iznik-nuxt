<template>
  <div>
    <b-row class="pb-1">
      <b-col>
        <div v-if="chatmessage.userid != $store.state.auth.user.id" class="media">
          <b-card border-variant="success">
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
              <b-img-lazy
                rounded="circle"
                thumbnail
                class="profilesm p-0 mb-1 inline mr-1 mt-1"
                alt="Profile picture"
                title="Profile"
                :src="otheruser.profile.turl"
                @error.native="brokenImage"
              /> <span class="small black"><b>{{ otheruser.displayname }}</b> has asked about</span>
              <br><h4>
                {{ refmsg.subject }}
              </h4>
            </b-card-title>
            <b-card-text>
              <b-alert v-if="refmsg.outcomes && refmsg.outcomes.length" show variant="info">
                <v-icon name="info-circle" />
                <span v-if="refmsg.type === 'Offer'">
                  This is no longer available.
                </span>
                <span v-else>
                  They are no longer looking for this.
                </span>
              </b-alert>
              <div :class="emessage ? 'media-body chatMessage' : 'media-body'">
                <span>
                  <span v-if="(chatmessage.secondsago < 60) || (chatmessage.id > chat.lastmsgseen)" class="prewrap"><b>{{ emessage }}</b></span>
                  <span v-else class="prewrap forcebreak">{{ emessage }}</span>
                  <b-img v-if="chatmessage.image" fluid :src="chatmessage.image.path" lazy rounded />
                </span>
              </div>
            </b-card-text>
          </b-card>
        </div>
        <div v-else class="media float-right">
          <b-card border-variant="success">
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
              <b-img-lazy
                rounded="circle"
                thumbnail
                class="profilesm p-0 mb-1 inline mr-1 mt-1"
                alt="Profile picture"
                title="Profile"
                :src="me.profile.turl"
                @error.native="brokenImage"
              /> <span class="small black">You asked about</span>
              <br><h4>
                {{ refmsg.subject }}
              </h4>
            </b-card-title>
            <b-card-text>
              <b-alert v-if="refmsg.outcomes && refmsg.outcomes.length" show variant="info">
                <v-icon name="info-circle" />
                <span v-if="refmsg.type === 'Offer'">
                  This is no longer available.
                </span>
                <span v-else>
                  They are no longer looking for this.
                </span>
              </b-alert>
              <div :class="emessage ? 'media-body chatMessage' : 'media-body'">
                <span>
                  <span v-if="(chatmessage.secondsago < 60) || (chatmessage.id > chat.lastmsgseen)" class="prewrap"><b>{{ emessage }}</b></span>
                  <span v-else class="prewrap forcebreak">{{ emessage }}</span>
                  <b-img v-if="chatmessage.image" fluid :src="chatmessage.image.path" lazy rounded />
                </span>
              </div>
            </b-card-text>
          </b-card>
        </div>
      </b-col>
    </b-row>
    <b-row v-if="!chatmessage.sameaslast" class="text-muted small">
      <b-col v-if="chatmessage.userid != $store.state.auth.user.id">
        <span style="padding-left: 30px">
          {{ $moment(chatmessage.date).fromNow() }}
        </span>
      </b-col>
      <b-col v-else>
        <span class="float-right" style="padding-right: 30px">
          {{ $moment(chatmessage.date).fromNow() }}
        </span>
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
