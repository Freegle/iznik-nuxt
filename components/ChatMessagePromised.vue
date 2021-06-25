<template>
  <div>
    <b-row class="pb-1">
      <b-col>
        <div v-if="chatmessage.userid != myid" class="media">
          <b-card border-variant="success">
            <b-card-title>
              <nuxt-link :to="(messageIsFromCurrentUser ? '/myposts' : '/message/') + refmsg.id">
                <b-img
                  v-if="refmsg && refmsg.attachments && refmsg.attachments.length > 0"
                  class="float-right ml-1"
                  rounded
                  thumbnail
                  generator-unable-to-provide-required-alt=""
                  lazy
                  :src="refmsg.attachments[0].paththumb"
                  width="70px"
                  @error="brokenImage"
                />
              </nuxt-link>
              <ProfileImage :image="otheruser.profile.turl" class="mr-1 mb-1 mt-1 inline" is-thumbnail size="sm" />
              <span class="small black">Good news! You've been promised this:</span>
              <br>
              <nuxt-link :to="(messageIsFromCurrentUser ? '/myposts' : '/message/') + refmsg.id">
                <h4>
                  {{ refmsg.subject }}
                </h4>
              </nuxt-link>
              <AddToCalendar v-if="tryst" :ics="tryst.ics" class="mr-2" />
            </b-card-title>
            <b-card-text>
              <div :class="emessage ? 'media-body chatMessage' : 'media-body'">
                <span>
                  <span v-if="(chatmessage.secondsago < 60) || (chatmessage.id > chat.lastmsgseen)" class="prewrap font-weight-bold">{{ emessage }}</span>
                  <span v-else class="preline forcebreak">{{ emessage }}</span>
                  <b-img v-if="chatmessage.image" fluid :src="chatmessage.image.path" lazy rounded />
                </span>
              </div>
            </b-card-text>
          </b-card>
        </div>
        <div v-else class="media float-right">
          <b-card border-variant="success">
            <b-card-title>
              <nuxt-link :to="(messageIsFromCurrentUser ? '/myposts' : '/message/') + refmsg.id">
                <b-img
                  v-if="refmsg && refmsg.attachments && refmsg.attachments.length > 0"
                  class="float-right"
                  rounded
                  thumbnail
                  generator-unable-to-provide-required-alt=""
                  lazy
                  :src="refmsg.attachments[0].paththumb"
                  width="70px"
                  @error="brokenImage"
                />
              </nuxt-link>
              <ProfileImage :image="me.profile.turl" class="mr-1 mb-1 mt-1 inline" is-thumbnail size="sm" />
              <span class="small black">You promised <strong>{{ otheruser.displayname }}</strong>:</span>
              <br>
              <nuxt-link :to="(messageIsFromCurrentUser ? '/myposts' : '/message/') + refmsg.id">
                <h4>
                  {{ refmsg.subject }}
                </h4>
              </nuxt-link>
              <p v-if="trystdate" class="small text-info">
                Handover arranged for <strong>{{ trystdate }}</strong>
              </p>
              <div class="d-flex mt-1 mb-1 flex-wrap justify-content-between">
                <template v-if="tryst">
                  <AddToCalendar :ics="tryst.ics" class="mr-2" />
                  <b-btn v-if="refmsg.promisecount && !hasOutcome" variant="secondary" class="mr-2" @click="changeTime">
                    <v-icon name="pen" />
                    Change time
                  </b-btn>
                  <PromiseModal ref="promise" :messages="[ refmsg ]" :selected-message="refmsg.id" :users="otheruser ? [ otheruser ] : []" :selected-user="otheruser ? otheruser.id : null" />
                </template>
                <template v-else-if="refmsg.promisecount && !hasOutcome">
                  <b-btn variant="secondary" class="mr-2" @click="changeTime">
                    <v-icon name="pen" />
                    Set time
                  </b-btn>
                  <PromiseModal ref="promise" :messages="[ refmsg ]" :selected-message="refmsg.id" :users="otheruser ? [ otheruser ] : []" :selected-user="otheruser ? otheruser.id : null" />
                </template>
                <b-btn v-if="refmsg.promisecount && !hasOutcome" variant="warning" class="align-middle mr-2" @click="unpromise">
                  Unpromise
                </b-btn>
                <b-btn variant="primary" class="mr-1" @click="outcome('Taken')">
                  Mark as TAKEN
                </b-btn>
              </div>
            </b-card-title>
            <b-card-text>
              <div :class="emessage ? 'media-body chatMessage' : 'media-body'">
                <span>
                  <span v-if="(chatmessage.secondsago < 60) || (chatmessage.id > chat.lastmsgseen)" class="prewrap font-weight-bold">{{ emessage }}</span>
                  <span v-else class="preline forcebreak">{{ emessage }}</span>
                  <b-img v-if="chatmessage.image" fluid :src="chatmessage.image.path" lazy rounded />
                </span>
              </div>
            </b-card-text>
          </b-card>
        </div>
      </b-col>
    </b-row>
    <RenegeModal ref="renege" :messages="[ refmsg ]" :selected-message="refmsg.id" :users="[otheruser ]" :selected-user="otheruser.id" />
    <OutcomeModal ref="outcomeModal" :message="refmsg" :taken-by="takenBy" />
  </div>
</template>

<script>
import OutcomeModal from '@/components/OutcomeModal'
import waitForRef from '../mixins/waitForRef'
import AddToCalendar from '~/components/AddToCalendar'
import ChatBase from '~/components/ChatBase'
import ProfileImage from '~/components/ProfileImage'

const RenegeModal = () => import('./RenegeModal')
const PromiseModal = () => import('~/components/PromiseModal')

export default {
  components: {
    OutcomeModal,
    AddToCalendar,
    ProfileImage,
    RenegeModal,
    PromiseModal
  },
  extends: ChatBase,
  mixins: [waitForRef],
  computed: {
    hasOutcome() {
      return this.refmsg && this.refmsg.outcomes && this.refmsg.outcomes.length
    },
    tryst() {
      return this.otheruser
        ? this.$store.getters['tryst/getByUser'](this.otheruser.id)
        : null
    },
    trystdate() {
      return this.tryst
        ? this.$dayjs(this.tryst.arrangedfor).format('dddd Do HH:mm a')
        : null
    },
    takenBy() {
      let ret = null

      if (this.otheruser) {
        ret = this.otheruser
        ret.userid = this.otheruser.id
        ret.count = 1
      }

      return ret
    }
  },
  methods: {
    unpromise() {
      this.waitForRef('renege', () => {
        this.$refs.renege.show()
      })
    },
    changeTime() {
      this.waitForRef('promise', () => {
        this.$refs.promise.show()
      })
    },
    async outcome(type) {
      await this.$store.dispatch('messages/fetch', {
        id: this.refmsg.id
      })

      this.waitForRef('outcomeModal', () => {
        this.$refs.outcomeModal.show(type)
      })
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
