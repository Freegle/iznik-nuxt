<template>
  <div>
    <b-row class="pb-1">
      <b-col>
        <div v-if="chatmessage.userid != myid" class="media">
          <b-card border-variant="success">
            <b-card-title>
              <b-img
                v-if="refmsg && refmsg.attachments && refmsg.attachments.length > 0"
                class="float-right"
                rounded
                thumbnail
                generator-unable-to-provide-required-alt=""
                lazy
                :src="refmsg.attachments[0].paththumb"
                width="70px"
                @error.native="brokenImage"
              />
              <ProfileImage :image="otheruser.profile.turl" class="mr-1 mb-1 mt-1 inline" is-thumbnail size="sm" />
              <span class="small black">Good news! You've been promised this:</span>
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
          <b-card border-variant="success">
            <b-card-title>
              <b-img
                v-if="refmsg && refmsg.attachments && refmsg.attachments.length > 0"
                class="float-right"
                rounded
                thumbnail
                generator-unable-to-provide-required-alt=""
                lazy
                :src="refmsg.attachments[0].paththumb"
                width="70px"
                @error.native="brokenImage"
              />
              <ProfileImage :image="me.profile.turl" class="mr-1 mb-1 mt-1 inline" is-thumbnail size="sm" />
              <span class="small black">You promised <b>{{ otheruser.displayname }}</b>:</span>
              <br>
              <h4>
                {{ refmsg.subject }}
              </h4>
              <b-btn v-if="refmsg.promised && !hasOutcome" variant="warning" class="align-middle mt-1 mb-1" @click="unpromise">
                <v-icon>
                  <v-icon name="handshake" />
                  <v-icon
                    name="slash"
                    class="unpromise__slash"
                  />
                </v-icon>
                Unpromise
              </b-btn>
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
    <RenegeModal ref="renege" :messages="[ refmsg ]" :selected-message="refmsg.id" :users="[otheruser ]" :selected-user="otheruser.id" />
  </div>
</template>

<script>
import ChatBase from '~/components/ChatBase'
import ProfileImage from '~/components/ProfileImage'
const RenegeModal = () => import('./RenegeModal')

export default {
  components: {
    ProfileImage,
    RenegeModal
  },
  extends: ChatBase,
  computed: {
    hasOutcome() {
      return this.refmsg && this.refmsg.outcomes && this.refmsg.outcomes.length
    }
  },
  methods: {
    unpromise() {
      this.$refs.renege.show()
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';

.unpromise__slash {
  transform: rotate(180deg);
  color: $color-red;
}
</style>
