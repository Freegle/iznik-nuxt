<template>
  <div class="d-inline">
    <div class="position-relative d-inline">
      <SpinButton
        :variant="variant"
        :name="icon"
        :label="label"
        class="mb-1"
        :spinclass="spinclass"
        :disabled="disabled"
        :handler="click"
      />
      <v-icon v-if="autosend" name="chevron-circle-right" title="Autosend - configured to send immediately without edit" class="autosend" />
    </div>
    <ConfirmModal v-if="showDeleteModal" ref="deleteConfirm" :title="'Delete: ' + member.displayname" @confirm="deleteConfirmed" />
    <ModSpammerReport v-if="showSpamModal" ref="spamConfirm" :user="member" />
    <ModStdMessageModal v-if="showStdMsgModal" ref="stdmodal" :stdmsg="stdmsg" :member="member" :autosend="autosend" />
  </div>
</template>
<script>
import ConfirmModal from './ConfirmModal'
import ModSpammerReport from './ModSpammerReport'
import SpinButton from './SpinButton'
const ModStdMessageModal = () => import('./ModStdMessageModal')

export default {
  components: {
    SpinButton,
    ModSpammerReport,
    ModStdMessageModal,
    ConfirmModal
  },

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
    delete: {
      type: Boolean,
      required: false,
      default: false
    },
    release: {
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
    reviewhold: {
      type: Boolean,
      required: false,
      default: false
    },
    reviewrelease: {
      type: Boolean,
      required: false,
      default: false
    },
    spamhold: {
      type: Boolean,
      required: false,
      default: false
    },
    spamignore: {
      type: Boolean,
      required: false,
      default: false
    },
    leave: {
      type: Boolean,
      required: false,
      default: false
    },
    autosend: {
      type: Boolean,
      required: false,
      default: false
    },
    reviewgroupid: {
      type: Number,
      required: false,
      default: null
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
      } else if (this.spamhold) {
        await this.spamHold()
      } else if (this.spamignore) {
        await this.spamIgnore()
      } else if (this.release) {
        console.log('Release')
        await this.releaseIt()
      } else if (this.reviewhold) {
        await this.reviewHoldIt()
      } else if (this.reviewrelease) {
        await this.reviewReleaseIt()
      } else {
        // We want to show a modal.
        if (this.leave) {
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
    async spamHold() {
      await this.$store.dispatch('spammers/hold', {
        id: this.member.spammer.id,
        userid: this.member.userid,
        myid: this.myid
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
    async reviewHoldIt() {
      await this.$store.dispatch('members/reviewHold', {
        membershipid: this.member.membershipid,
        groupid: this.reviewgroupid
      })
    },
    async reviewReleaseIt() {
      await this.$store.dispatch('members/reviewRelease', {
        membershipid: this.member.membershipid,
        groupid: this.reviewgroupid
      })
    },
    async releaseIt() {
      await this.$store.dispatch('spammers/release', {
        id: this.member.spammer.id,
        userid: this.member.userid
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
