<template>
  <div class="d-inline">
    <b-btn :variant="variant" class="mb-1" :disabled="disabled" @click="click">
      <v-icon :name="icon" /> {{ label }}
    </b-btn>
    <ConfirmModal v-if="showDeleteModal" ref="deleteConfirm" :title="'Delete: ' + member.displayname" @confirm="deleteConfirmed" />
    <ConfirmModal v-if="showSpamModal" ref="spamConfirm" :title="'Mark as Spammer: ' + member.displayname" @confirm="spamConfirmed" />
    <ModStdMessageModal v-if="showStdMsgModal" ref="stdmodal" :stdmsg="stdmsg" :member="member" />
  </div>
</template>
<script>
import ConfirmModal from './ConfirmModal'
import WaitForRef from '@/mixins/waitForRef'
const ModStdMessageModal = () => import('./ModStdMessageModal')

export default {
  components: {
    ModStdMessageModal,
    ConfirmModal
  },
  mixins: [WaitForRef],
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
    spam: {
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
    notspam: {
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
    }
  },
  methods: {
    async click() {
      if (this.approve) {
        // Standard approve button - no modal.
        this.approveIt()
      } else if (this.delete) {
        // Standard delete button - no modal.
        this.deleteIt()
      } else if (this.spam) {
        // Standard spam button - no modal.
        this.spamIt()
      } else if (this.notspam) {
        // Standard notspam button - no modal.
        this.notSpamIt()
      } else if (this.hold) {
        // Standard hold button - no modal.
        this.holdIt()
      } else if (this.release) {
        // Standard release button - no modal.
        this.releaseIt()
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
    approveIt() {
      this.$store.dispatch('members/approve', {
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
    spamIt() {
      this.showSpamModal = true
      this.waitForRef('spamConfirm', () => {
        this.$refs.spamConfirm.show()
      })
    },
    notSpamIt() {
      this.$store.dispatch('members/notspam', {
        id: this.member.userid,
        groupid: this.groupid
      })
    },
    deleteConfirmed() {
      this.$store.dispatch('members/delete', {
        id: this.member.userid,
        groupid: this.groupid
      })
    },
    spamConfirmed() {
      this.$store.dispatch('members/spam', {
        id: this.member.userid,
        groupid: this.groupid
      })
    },
    holdIt() {
      this.$store.dispatch('members/hold', {
        id: this.member.userid
      })
    },
    releaseIt() {
      this.$store.dispatch('members/release', {
        id: this.member.userid
      })
    }
  }
}
</script>
