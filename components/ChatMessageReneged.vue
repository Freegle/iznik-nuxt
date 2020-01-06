<template>
  <div>
    <b-row class="pb-1">
      <b-col>
        <div v-if="chatmessage.userid != $store.state.auth.user.id" class="media">
          <b-card border-variant="warning">
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
              <profile-image :image="otheruser.profile.turl" class="mr-1 mb-1 mt-1 inline" is-thumbnail size="sm" />
              <span class="small black">Sorry...this is no longer promised to you:</span>
              <br>
              <h4>
                {{ refmsg.subject }}
              </h4>
            </b-card-title>
            <b-card-text>
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
          <b-card border-variant="warning">
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
              <profile-image :image="me.profile.turl" class="mr-1 mb-1 mt-1 inline" is-thumbnail size="sm" />
              <span class="small black">You cancelled your promise to <b>{{ otheruser.displayname }}</b> for:</span>
              <br>
              <h4>
                {{ refmsg.subject }}
              </h4>
            </b-card-title>
            <b-card-text>
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

<script>
import ChatBase from '~/components/ChatBase'
const ProfileImage = () => import('~/components/ProfileImage')

export default {
  components: {
    ProfileImage
  },
  extends: ChatBase
}
</script>

<style scoped>
</style>
