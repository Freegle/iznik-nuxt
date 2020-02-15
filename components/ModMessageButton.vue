<template>
  <div class="d-inline">
    <b-btn :variant="variant" class="mb-1" @click="click">
      <v-icon :name="icon" /> {{ label }}
    </b-btn>
    <ConfirmModal v-if="showDeleteModal" ref="deleteConfirm" @confirm="deleteConfirmed" />
    <ConfirmModal v-if="showSpamModal" ref="spamConfirm" @confirm="spamConfirmed" />
    <ModStdMessageModal v-if="showStdMsgModal" ref="stdmodal" :stdmsgid="stdmsg ? stdmsg.id : null" :message="message" />
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
    message: {
      type: Object,
      required: true
    },
    stdmsg: {
      type: Object,
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
    approve: {
      type: Boolean,
      required: false,
      default: false
    },
    delete: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      showDeleteModal: false,
      showStdMsgModal: false,
      showSpamModal: false
    }
  },
  computed: {
    groupid() {
      let ret = null

      if (this.message && this.message.groups && this.message.groups.length) {
        ret = this.message.groups[0].groupid
      }

      return ret
    }
  },
  methods: {
    click() {
      if (this.approve) {
        // Standard approve button
        this.approveIt()
      } else if (this.delete) {
        // Standard delete button
        this.deleteIt()
      } else if (this.spam) {
        // Standard spam button
        this.spamIt()
      } else {
        // Something else.  We want to show the modal.  Setting this will cause it to render here.
        this.showStdMsgModal = true
        this.waitForRef('stdmodal', () => {
          this.$refs.stdmodal.show()
        })
      }
    },
    approveIt() {
      this.$store.dispatch('messages/approve', {
        id: this.message.id,
        groupid: this.groupid
      })
    },
    deleteIt() {
      this.showDeleteModal = true
      this.waitForRef('config', () => {
        this.$refs.deleteConfirm.show()
      })
    },
    spamIt() {
      this.showSpamModal = true
      this.waitForRef('config', () => {
        this.$refs.spamConfirm.show()
      })
    },
    deleteConfirmed() {
      this.$store.dispatch('messages/approve', {
        id: this.message.id,
        groupid: this.groupid
      })
    },
    spamConfirmed() {
      this.$store.dispatch('messages/spam', {
        id: this.message.id,
        groupid: this.groupid
      })
    }
  }
}
</script>
