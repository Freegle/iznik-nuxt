<template>
  <div class="d-inline">
    <b-btn :variant="variant" class="mb-1" @click="click">
      <v-icon :name="icon" /> {{ label }}
    </b-btn>
    <ConfirmModal ref="confirm" @confirm="deleteConfirmed" />
  </div>
</template>
<script>
import ConfirmModal from './ConfirmModal'

export default {
  components: {
    ConfirmModal
  },
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
  computed: {},
  methods: {
    click() {
      if (this.approve) {
        // Standard approve button
        this.approveIt()
      } else if (this.delete) {
        // Standard delete button
      } else {
        // Something else
      }
    },
    approveIt() {
      this.$store.dispatch('messages/approve', {
        id: this.message.id,
        groupid: this.groupid
      })
    },
    deleteIt() {
      this.$refs.confirm.show()
    },
    deleteConfirmed() {
      this.$store.dispatch('messages/approve', {
        id: this.message.id,
        groupid: this.groupid
      })
    }
  }
}
</script>
<style scoped>
</style>
