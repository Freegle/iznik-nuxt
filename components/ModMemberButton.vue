<template>
  <div class="d-inline">
    <SpinButton
      :variant="variant"
      :name="icon"
      :label="label"
      class="mb-1"
      :spinclass="spinclass"
      :disabled="disabled"
      :handler="click"
    />
    <ConfirmModal v-if="showDeleteModal" ref="deleteConfirm" :title="'Delete: ' + member.displayname" @confirm="deleteConfirmed" />
    <ModSpammerReport v-if="showSpamModal" ref="spamConfirm" :user="member" />
    <ModStdMessageModal v-if="showStdMsgModal" ref="stdmodal" :stdmsg="stdmsg" :member="member" />
  </div>
</template>
<script>
import ConfirmModal from './ConfirmModal'
import ModSpammerReport from './ModSpammerReport'
import SpinButton from './SpinButton'
import waitForRef from '@/mixins/waitForRef'
const ModStdMessageModal = () => import('./ModStdMessageModal')

export default {
  components: {
    SpinButton,
    ModSpammerReport,
    ModStdMessageModal,
    ConfirmModal
  },
  mixins: [waitForRef],
  props: {
    member: {
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
    spamreport: {
      type: Boolean,
      required: false,
      default: false
    },
    spamrequestremove: {
      type: Boolean,
      required: false,
      default: false
    },
    spamremove: {
      type: Boolean,
      required: false,
      default: false
    },
    spamconfirm: {
      type: Boolean,
      required: false,
      default: false
    },
    spamwhitelist: {
      type: Boolean,
      required: false,
      default: false
    },
    spamignore: {
      type: Boolean,
      required: false,
      default: false
    },
    hold: {
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
      // For member entries this is returned at the top level.
      return this.member.groupid
    },
    spinclass() {
      if (this.variant === 'primary') {
        // Primary buttons have "success" (green) class.
        return 'success'
      }

      return null
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
      } else if (this.spamreport) {
        await this.spamReport()
      } else if (this.spamconfirm) {
        await this.spamConfirm()
      } else if (this.spamrequestremove) {
        await this.spamRequestRemove()
      } else if (this.spamremove) {
        await this.spamRemove()
      } else if (this.spamwhitelist) {
        await this.spamWhitelist()
      } else if (this.spamignore) {
        await this.spamIgnore()
      } else if (this.hold) {
        // Standard hold button - no modal.
        await this.holdIt()
      } else if (this.release) {
        // Standard release button - no modal.
        await this.releaseIt()
      } else {
        // We want to show a modal.
        if (this.reject) {
          this.stdmsg = {
            action: 'Reject Member'
          }
        } else if (this.leave) {
          this.stdmsg = {
            action: 'Leave Member'
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
      await this.$store.dispatch('members/approve', {
        id: this.member.userid,
        groupid: this.groupid
      })
    },
    deleteIt() {
      this.showDeleteModal = true
      this.waitForRef('deleteConfirm', () => {
        this.$refs.deleteConfirm.show()
      })
    },
    spamReport() {
      this.showSpamModal = true
      this.waitForRef('spamConfirm', () => {
        this.$refs.spamConfirm.show()
      })
    },
    async spamConfirm() {
      await this.$store.dispatch('spammers/confirm', {
        id: this.member.spammer.id,
        userid: this.member.userid
      })
    },
    async spamRequestRemove() {
      await this.$store.dispatch('spammers/requestremove', {
        id: this.member.spammer.id,
        userid: this.member.userid
      })
    },
    async spamRemove() {
      await this.$store.dispatch('spammers/remove', {
        id: this.member.spammer.id,
        userid: this.member.userid
      })
    },
    async spamWhitelist() {
      await this.$store.dispatch('spammers/whitelist', {
        id: this.member.spammer.id,
        userid: this.member.userid
      })
    },
    async spamIgnore() {
      await this.$store.dispatch('members/spamignore', {
        userid: this.member.userid,
        groupid: this.groupid
      })
    },
    async deleteConfirmed() {
      await this.$store.dispatch('members/delete', {
        id: this.member.userid,
        groupid: this.groupid
      })
    },
    async holdIt() {
      await this.$store.dispatch('members/hold', {
        userid: this.member.userid,
        groupid: this.groupid
      })
    },
    async releaseIt() {
      await this.$store.dispatch('members/release', {
        userid: this.member.userid,
        groupid: this.groupid
      })
    }
  }
}
</script>
