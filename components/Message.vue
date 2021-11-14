<template>
  <div v-if="message" :id="'msg-' + id" class="position-relative ml-2 mr-2 ml-sm-0 mr-sm-0" itemscope itemtype="http://schema.org/Product">
    <div itemprop="offers" itemscope itemtype="http://schema.org/Offer" class="d-none">
      <meta itemprop="priceCurrency" content="GBP">
      <span itemprop="price">0</span> |
      <span itemprop="availability">Instock</span>
    </div>
    <div v-if="startExpanded">
      <MessageExpanded
        :id="message.id"
        :replyable="replyable"
        :hide-close="hideClose"
        :actions="actions"
        :show-map="true"
        class="bg-white p-2"
        @zoom="showPhotosModal"
      />
      <MessagePhotosModal
        :id="message.id"
        ref="photoModal"
      />
    </div>
    <div v-else>
      <MessageSummary :id="message.id" :expand-button-text="expandButtonText" :replyable="replyable" @expand="expand" @zoom="zoom" />
      <MessageModal
        :id="message.id"
        ref="modal"
        :replyable="replyable"
        :hide-close="hideClose"
        :actions="actions"
      />
    </div>
  </div>
</template>

<script>
// Need to import rather than async otherwise the render doesn't happen and ref isn't set.
import Vue from 'vue'
import { TooltipPlugin } from 'bootstrap-vue'
import MessageSummary from '@/components/MessageSummary'

import MessageModal from '@/components/MessageModal'
import MessageExpanded from '@/components/MessageExpanded'

const MessagePhotosModal = () => import('./MessagePhotosModal')

Vue.use(TooltipPlugin)

export default {
  components: {
    MessageExpanded,
    MessageModal,
    MessageSummary,
    MessagePhotosModal
  },

  props: {
    id: {
      type: Number,
      required: true
    },
    expandButtonText: {
      type: String,
      required: false,
      default: 'See details and reply'
    },
    startExpanded: {
      type: Boolean,
      required: false,
      default: false
    },
    hideClose: {
      type: Boolean,
      required: false,
      default: false
    },
    replyable: {
      type: Boolean,
      required: false,
      default: true
    },
    actions: {
      type: Boolean,
      required: false,
      default: true
    },
    recordView: {
      type: Boolean,
      required: true
    }
  },
  data: function() {
    return {
      expanded: false,
      reply: null
    }
  },
  computed: {
    message() {
      return this.$store.getters['messages/get'](this.id)
    },
    showMap() {
      return this.message.lat || this.message.lng
    },
    home() {
      let ret = null

      if (this.me && this.me.settings && this.me.settings.mylocation) {
        ret = {
          lat: this.me.settings.mylocation.lat,
          lng: this.me.settings.mylocation.lng
        }
      }

      return ret
    },
    stillAvailable() {
      return (
        this.message.type === 'Offer' &&
        this.reply &&
        this.reply.length <= 35 &&
        this.reply.toLowerCase().indexOf('still available') !== -1
      )
    },
    replyToUser() {
      const msg = this.$store.getters['messages/get'](this.id)

      if (msg && msg.fromuser) {
        return msg.fromuser.id
      }

      return null
    },
    position() {
      let ret = null

      if (this.message) {
        if (this.message.location) {
          // This is what we put in for message submitted on FD.
          ret = this.message.location
        } else if (this.message.lat || this.message.lng) {
          // This happens for TN messages
          ret = {
            lat: this.message.lat,
            lng: this.message.lng
          }
        }
      }

      return ret
    }
  },
  watch: {
    async replyToSend(newVal, oldVal) {
      // Because of the way persistent store is restored, we might only find out that we have a reply to send
      // post-mount.
      if (newVal && newVal.replyTo === this.id) {
        this.reply = newVal.replyMessage
        await this.expand()

        this.$nextTick(() => {
          this.sendReply()
        })
      }
    }
  },
  async mounted() {
    if (this.startExpanded) {
      this.view()
    }

    const reply = this.replyToSend

    if (reply && reply.replyTo === this.id) {
      // Because of the way persistent store is restored, we might or might not know that we have a reply to send
      // in the mount, or we might only pick it up in the watch.
      this.reply = reply.replyMessage
      await this.expand()
      this.sendReply()
    }
  },
  methods: {
    expand(zoom) {
      if (!this.message.successful) {
        this.expanded = true

        this.waitForRef('modal', () => {
          this.$refs.modal.show(zoom)
          this.$store.dispatch('messages/fetch', {
            id: this.id
          })
        })

        this.view()
      }
    },
    zoom() {
      this.expand(true)
    },
    showPhotosModal() {
      console.log('Show photos modal')
      this.waitForRef('photoModal', () => {
        this.$refs.photoModal.show()
      })
    },
    async view() {
      if (this.recordView) {
        if (this.me) {
          await this.$store.dispatch('messages/view', {
            id: this.id
          })
        }

        this.$emit('view')
      }
    },
    share() {
      if (process.env.IS_APP) { // CC..
        console.log('Message.vue')
        const href = 'https://www.ilovefreegle.org/message/' + this.id + '?src=mobileshare'
        console.log('Message.vue href', href)
        const subject = this.subject
        console.log('Message.vue subject', subject)
        // https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
        const options = {
          message: "I saw this on Freegle - interested?\n\n", // not supported on some apps (Facebook, Instagram)
          subject: 'Freegle post: ' + subject, // for email
          //files: ['', ''], // an array of filenames either locally or remotely
          url: href,
          //chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
        }

        const onSuccess = function (result) {
          console.log("Share completed? " + result.completed)   // On Android apps mostly return false even while it's true
          console.log("Shared to app: " + result.app)           // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
        }

        const onError = function (msg) {
          console.log("Sharing failed with message: " + msg)
        }

        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError)
      } else {
        this.$refs.shareModal.show()
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

/deep/ label {
  font-weight: bold;
}
</style>
