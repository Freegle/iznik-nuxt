<template>
  <div>
    <ModConfigSetting
      :configid="config.id"
      :name="cc"
      label="BCC to:"
      description="You can choose whether standard messages get copied by email."
      type="select"
      :options="ccopts"
    />
    <ModConfigSetting
      v-if="config[cc] === 'Specific'"
      :configid="config.id"
      :name="addr"
      label="Specific address:"
      description="This is the address to BCC messages to."
    />
    <p>
      Click on a button to edit the message. Drag and drop to change the order that they'll show in on the relevant
      pages (e.g. put the ones you use most first).
    </p>
    <draggable :key="'list-' + bump" v-model="stdmsgscopy" group="buttons" class="d-flex justify-content-center flex-wrap" @end="updateOrder">
      <div
        v-for="stdmsg in stdmsgscopy"
        :key="'stdmsg-' + stdmsg.id"
      >
        <ModSettingsStandardMessageButton
          v-if="visible(stdmsg)"
          :stdmsg="stdmsg"
        />
      </div>
    </draggable>
    <b-btn variant="white" @click="add">
      <v-icon name="plus" /> Add new standard message
    </b-btn>
    <ModSettingsStandardMessageModal v-if="showModal" ref="msgmodal" @hide="fetch" />
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import stdmsgs from '../mixins/stdmsgs'
import ModConfigSetting from './ModConfigSetting'
import ModSettingsStandardMessageButton from './ModSettingsStandardMessageButton'
import ModSettingsStandardMessageModal from './ModSettingsStandardMessageModal'
import waitForRef from '@/mixins/waitForRef'

export default {
  components: {
    ModSettingsStandardMessageButton,
    ModConfigSetting,
    draggable,
    ModSettingsStandardMessageModal
  },
  mixins: [waitForRef, stdmsgs],
  props: {
    cc: {
      type: String,
      required: true
    },
    addr: {
      type: String,
      required: true
    },
    types: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      ccopts: [
        { value: 'Nobody', text: 'Nobody' },
        { value: 'Me', text: 'Me' },
        { value: 'Specific', text: 'Specific email' }
      ],
      stdmsgscopy: null,
      showModal: false,
      bump: 0
    }
  },
  computed: {
    config() {
      return this.$store.getters['modconfigs/current']
    }
  },
  watch: {
    config(newval) {
      console.log('New config')
      this.stdmsgscopy = this.copyStdMsgs(newval)
    }
  },
  mounted() {
    this.stdmsgscopy = this.copyStdMsgs(this.config)
  },
  methods: {
    updateOrder() {
      // Undivided joy, we have new order.
      const newOrder = this.stdmsgscopy.map(s => s.id)

      this.$store.dispatch('modconfigs/updateConfig', {
        id: this.config.id,
        messageorder: JSON.stringify(newOrder)
      })
    },
    visible(stdmsg) {
      return this.types.indexOf(stdmsg.action) !== -1
    },
    add() {
      this.showModal = true
      this.waitForRef('msgmodal', () => {
        this.$refs.msgmodal.show()
      })
    },
    async fetch() {
      // Update any changed/new buttons.
      await this.$store.dispatch('modconfigs/fetchConfig', {
        id: this.config.id,
        configuring: true
      })

      const config = this.$store.getters['modconfigs/current']
      this.stdmsgscopy = this.copyStdMsgs(config)
      this.bump++
    }
  }
}
</script>
