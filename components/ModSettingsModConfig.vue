<template>
  <div>
    <b-select v-model="configid" :options="configOptions" class="mb-2 font-weight-bold" />
    <b-img v-if="loading" src="~static/loader.gif" class="d-block mt-2" />
    <div v-else-if="config">
      <h2>General Settings</h2>
      <ModConfigSetting
        :configid="configid"
        name="name"
        label="Name"
        description="This is the name of this collection of standard messages.  It appears on Community when you're choosing which collection to apply to your community."
      />
      <p>
        Standard messages appear as buttons on other pages, and allow you to quickly
        send a message to a user, and perform common operations on them such as changing their moderation
        status.
      </p>
      <p>
        Click on a button to edit the message. Drag and drop to change the order.
      </p>
    </div>
  </div>
</template>
<script>
import ModConfigSetting from './ModConfigSetting'
export default {
  components: { ModConfigSetting },
  data: function() {
    return {
      configid: null,
      loading: false
    }
  },
  computed: {
    configOptions() {
      const ret = [
        {
          value: null,
          text: '-- Please choose --'
        }
      ]

      const configs = this.$store.getters['modconfigs/configs']

      configs.forEach(c => {
        ret.push({
          value: c.id,
          text: c.name
        })
      })

      return ret
    },
    config() {
      return this.$store.getters['modconfigs/current']
    }
  },
  watch: {
    async configid(newval) {
      this.loading = true

      await this.$store.dispatch('modconfigs/fetchConfig', {
        id: newval,
        configuring: true
      })

      this.loading = false
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

input,
select {
  max-width: 300px;
}
</style>
