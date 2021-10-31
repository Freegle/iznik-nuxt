<template>
  <div class="d-inline">
    <b-btn :variant="variant(stdmsg)" class="mb-1 mr-2" @click="click">
      <v-icon :name="icon(stdmsg)" /> {{ stdmsg.title }}
    </b-btn>
    <ModSettingsStandardMessageModal v-if="showModal" :id="stdmsg.id" ref="msgmodal" />
  </div>
</template>
<script>
import stdmsgs from '../mixins/stdmsgs'
import ModSettingsStandardMessageModal from './ModSettingsStandardMessageModal'

export default {
  components: { ModSettingsStandardMessageModal },
  mixins: [stdmsgs],
  props: {
    stdmsg: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      showModal: false
    }
  },
  methods: {
    click() {
      this.showModal = true
      this.waitForRef('msgmodal', () => {
        this.$refs.msgmodal.show()
      })
    }
  }
}
</script>
