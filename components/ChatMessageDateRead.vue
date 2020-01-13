<template>
  <b-row v-if="!chatmessage.sameasnext || last" class="text-muted small">
    <b-col v-if="chatmessage.userid !== me.id">
      <span style="padding-left: 30px">
        {{ $dayjs(chatmessage.date).fromNow() }}
      </span>
    </b-col>
    <b-col v-else>
      <span class="float-right" style="padding-right: 30px">
        <v-icon v-if="chatmessage.seenbyall" name="check" class="text-success" />
        <v-icon v-else-if="chatmessage.mailedtoall" name="envelope" />
        {{ $dayjs(chatmessage.date).fromNow() }}
      </span>
    </b-col>
  </b-row>
</template>
<script>
export default {
  props: {
    chatmessage: {
      type: Object,
      required: true
    },
    last: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    me() {
      return this.$store.getters['auth/user']
    }
  }
}
</script>
