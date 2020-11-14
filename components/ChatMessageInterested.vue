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
              <div v-if="otheruser">
                <ProfileImage :image="otheruser.profile.turl" class="mr-1 mb-1 mt-1 inline" is-thumbnail size="sm" />
                <span class="small black"><b>{{ otheruser.displayname }}</b> has
                  <span v-if="refmsg && refmsg.type === 'Offer'">asked</span>
                  <span v-else>replied</span>
                  about:
                </span>
              </div>
              <nuxt-link :to="!messageIsFromCurrentUser ? '/myposts' : ('/message/' + refmsg.id)">
                <h4 class="mt-1">
                  {{ refmsg.subject }}
                  <b-badge v-if="refmsg.availableinitially > 1" variant="info">
                    {{ refmsg.availablenow }} left
                  </b-badge>
                </h4>
              </nuxt-link>
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
                  <span v-else class="preline forcebreak">{{ emessage }}</span>
                  <b-img v-if="chatmessage.image" fluid :src="chatmessage.image.path" lazy rounded />
                </span>
              </div>
            </b-card-text>
            <div v-if="refmsg && refmsg.type === 'Offer' && (!refmsg.outcomes || !refmsg.outcomes.length)">
              <hr>
              <div class="text-center small text-muted">
                No longer available?
              </div>
              <div class="d-flex justify-content-between">
                <b-btn variant="primary" size="sm" @click="outcome('Taken')">
                  Mark as TAKEN
                </b-btn>
                <b-btn variant="secondary" size="sm" @click="outcome('Withdrawn')">
                  Withdraw
                </b-btn>
              </div>
              <OutcomeModal ref="outcomeModal" :message="refmsg" />
            </div>
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
              <span class="small black">You asked about:</span>
              <h4 class="mt-1">
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
                  <span v-else class="preline forcebreak">{{ emessage }}</span>
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
import ProfileImage from '~/components/ProfileImage'
const NoticeMessage = () => import('~/components/NoticeMessage')
const OutcomeModal = () => import('~/components/OutcomeModal')

export default {
  components: {
    NoticeMessage,
    ProfileImage,
    OutcomeModal
  },
  extends: ChatBase,
  computed: {
    replyusers() {
      const ret = []
      const retids = []

      const message = this.$store.getters['messages/get'](this.refmsg.id)

      if (message) {
        if (this.refmsg && message.replies) {
          for (const reply of message.replies) {
            if (retids.indexOf(reply.user.id) === -1) {
              ret.push(reply.user)
              retids[reply.userid] = true
            }
          }
        }
      }

      return ret
    }
  },
  methods: {
    async outcome(type) {
      await this.$store.dispatch('messages/fetch', {
        id: this.refmsg.id
      })

      this.$refs.outcomeModal.show(type)
    }
  }
}
</script>
