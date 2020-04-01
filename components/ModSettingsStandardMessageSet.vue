<template>
  <div>
    <ModConfigSetting
      :configid="config.id"
      :name="cc"
      label="BCC to"
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
      Click on a button to edit the message. Drag and drop to change the order.
    </p>
    TODO ADD
    <draggable v-model="stdmsgscopy" group="buttons" class="d-flex justify-content-start flex-wrap" @end="updateOrder">
      <div
        v-for="stdmsg in stdmsgscopy"
        :key="'stdmsg-' + stdmsg.id"
      >
        <ModSettingsStdMsgButton
          v-if="visible(stdmsg)"
          :stdmsg="stdmsg"
          class="mr-2"
        />
      </div>
    </draggable>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import ModConfigSetting from './ModConfigSetting'
import ModSettingsStdMsgButton from './ModSettingsStdMsgButton'

export default {
  components: { ModSettingsStdMsgButton, ModConfigSetting, draggable },
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
      stdmsgscopy: null
    }
  },
  computed: {
    config() {
      return this.$store.getters['modconfigs/current']
    }
  },
  mounted() {
    this.copyStdMsgs(this.config.stdmsgs)
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
    copyStdMsgs(stdmsgs) {
      // We need to sort them according to the message order.
      let order = this.config.messageorder
      console.log('Got order', order)
      let copy = []

      if (order) {
        order = JSON.parse(order)
        console.log('Decoded')
        do {
          const thisone = parseInt(order.shift())
          console.log('Look for', thisone)

          stdmsgs.forEach(s => {
            console.log('Compare', thisone, parseInt(s.id))
            if (thisone === parseInt(s.id)) {
              console.log('Found')
              copy.push(s)
            }
          })
          console.log('continue', order.length)
        } while (order.length)
      } else {
        copy = stdmsgs
      }

      this.stdmsgscopy = copy
    }
  }
}
</script>
