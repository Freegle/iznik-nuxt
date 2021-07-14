<template>
  <div class="d-inline">
    <div class="position-relative d-inline">
      <SpinButton
        :variant="variant"
        :spinclass="spinclass"
        :name="icon"
        :label="label"
        class="mb-1"
        :disabled="disabled"
        :handler="click"
        :confirm="confirmButton"
      />
      <v-icon v-if="autosend" name="chevron-circle-right" title="Autosend - configured to send immediately without edit" class="autosend" />
    </div>
    <ConfirmModal v-if="showDeleteModal" ref="deleteConfirm" :title="'Delete: ' + message.subject" @confirm="deleteConfirmed" />
    <ConfirmModal v-if="showSpamModal" ref="spamConfirm" :title="'Mark as Spam: ' + message.subject" @confirm="spamConfirmed" />
    <ModStdMessageModal v-if="showStdMsgModal" ref="stdmodal" :stdmsg="stdmsg" :message="message" :autosend="autosend" />
  </div>
</template>
<script>
import waitForRef from '@/mixins/waitForRef'
import ConfirmModal from './ConfirmModal'
import SpinButton from './SpinButton'
const ModStdMessageModal = () => import('./ModStdMessageModal')

export default {
  components: {
    SpinButton,
    ModStdMessageModal,
    ConfirmModal
  },
  mixins: [waitForRef],
  props: {
    message: {
      type: Object,
      required: true
    },
    stdmsgid: {
      type: Number,
      required: false,
      default: null
    },
    variant: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    approve: {
      type: Boolean,
      required: false,
      default: false
    },
    delete: {
      type: Boolean,
      required: false,
      default: false
    },
    hold: {
      type: Boolean,
      required: false,
      default: false
    },
    holdMessage: {
      type: Boolean,
      required: false,
      default: false
    },
    release: {
      type: Boolean,
      required: false,
      default: false
    },
    reject: {
      type: Boolean,
      required: false,
      default: false
    },
    leave: {
      type: Boolean,
      required: false,
      default: false
    },
    spam: {
      type: Boolean,
      required: false,
      default: false
    },
    approveedits: {
      type: Boolean,
      required: false,
      default: false
    },
    revertedits: {
      type: Boolean,
      required: false,
      default: false
    },
    autosend: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      showDeleteModal: false,
      showStdMsgModal: false,
      showSpamModal: false,
      stdmsg: null
    }
  },
  computed: {
    groupid() {
      let ret = null

      if (this.message && this.message.groups && this.message.groups.length) {
        ret = this.message.groups[0].groupid
      }

      return ret
    },
    spinclass() {
      if (this.variant === 'primary') {
        // Primary buttons have "success" (green) class.
        return 'success'
      }

      return null
    },
    confirmButton() {
      // We confirm any actions on held messages, except where we have a separate confirm.
      return this.message.heldby && !this.spam && !this.delete
    }
  },
  methods: {
    async click() {
      if (this.approve) {
        // Standard approve button - no modal.
        await this.approveIt()
      } else if (this.delete) {
        // Standard delete button - no modal.
        await this.deleteIt()
      } else if (this.hold) {
        // Standard hold button - no modal.
        await this.holdIt()
      } else if (this.release) {
        // Standard release button - no modal.
        await this.releaseIt()
      } else if (this.spam) {
        // Standard spam button.
        this.showSpamModal = true
        this.waitForRef('spamConfirm', () => {
          this.$refs.spamConfirm.show()
        })
      } else if (this.approveedits) {
        await this.approveEdits()
      } else if (this.revertedits) {
        await this.revertEdits()
      } else {
        // We want to show a modal.
        if (this.reject) {
          this.stdmsg = {
            action: 'Reject'
          }
        } else if (this.leave) {
          this.stdmsg = {
            action: 'Leave'
          }
        } else if (this.stdmsgid) {
          // We have a standard message.  Fetch it.
          this.stdmsg = await this.$store.dispatch('stdmsgs/fetch', {
            id: this.stdmsgid
          })
        }

        this.showStdMsgModal = true
        this.waitForRef('stdmodal', () => {
          this.$refs.stdmodal.show()
        })
      }
    },
    async approveIt() {
      await this.$store.dispatch('messages/approve', {
        id: this.message.id,
        groupid: this.groupid
      })
    },
    deleteIt() {
      this.showDeleteModal = true
      this.waitForRef('deleteConfirm', () => {
        this.$refs.deleteConfirm.show()
      })
    },
    async deleteConfirmed() {
      await this.$store.dispatch('messages/delete', {
        id: this.message.id,
        groupid: this.groupid
      })
    },
    async spamConfirmed() {
      await this.$store.dispatch('messages/spam', {
        id: this.message.id,
        groupid: this.groupid
      })
    },
    async holdIt() {
      await this.$store.dispatch('messages/hold', {
        id: this.message.id
      })
    },
    async releaseIt() {
      await this.$store.dispatch('messages/release', {
        id: this.message.id
      })
    },
    async approveEdits() {
      await this.$store.dispatch('messages/approveedits', {
        id: this.message.id
      })
    },
    async revertEdits() {
      await this.$store.dispatch('messages/revertedits', {
        id: this.message.id
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.autosend {
  right: 4px;
  bottom: -20px;
  position: absolute;
  color: $color-purple;
}
</style>
