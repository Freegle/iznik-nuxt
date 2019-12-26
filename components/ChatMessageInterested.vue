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
              /> <span class="small black"><b>{{ otheruser.displayname }}</b> has asked about:</span>
              <br><h4>
                {{ refmsg.subject }}
              </h4>
            </b-card-title>
            <b-card-text>
              <notice-message v-if="refmsg.outcomes && refmsg.outcomes.length" class="mb-3">
                <v-icon name="info-circle" />
                <span v-if="refmsg.type === 'Offer'">
                  This is no longer available.
                </span>
                <span v-else>
                  They are no longer looking for this.
                </span>
              </notice-message>
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
              /> <span class="small black">You asked about:</span>
              <br><h4>
                {{ refmsg.subject }}
              </h4>
            </b-card-title>
            <b-card-text>
              <notice-message v-if="refmsg.outcomes && refmsg.outcomes.length" class="mb-3">
                <v-icon name="info-circle" />
                <span v-if="refmsg.type === 'Offer'">
                  This is no longer available.
                </span>
                <span v-else>
                  They are no longer looking for this.
                </span>
              </notice-message>
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
  </div>
</template>
<style scoped>
</style>
<script>
import 'vue-awesome/icons/info-circle'
import ChatBase from '~/components/ChatBase'
const NoticeMessage = () => import('~/components/NoticeMessage')

export default {
  components: {
    NoticeMessage
  },
  extends: ChatBase
}
</script>
