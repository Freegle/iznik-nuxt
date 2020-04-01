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
    <div class="d-flex justify-content-start flex-wrap">
      <ModSettingsStdMsgButton
        v-for="stdmsg in stdmsgs"
        :key="'stdmsg-' + stdmsg.id"
        :stdmsg="stdmsg"
        class="mr-2"
      />
    </div>
  </div>
</template>
<script>
import ModConfigSetting from './ModConfigSetting'
import ModSettingsStdMsgButton from './ModSettingsStdMsgButton'
export default {
  components: { ModSettingsStdMsgButton, ModConfigSetting },
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
      ]
    }
  },
  computed: {
    config() {
      return this.$store.getters['modconfigs/current']
    },
    stdmsgs() {
      return (
        this.config &&
        this.config.stdmsgs.filter(s => {
          return this.types.indexOf(s.action) !== -1
        })
      )
    }
  }
}
</script>
