<template>
  <div class="d-inline">
    <b-btn :variant="variant(stdmsg)" class="mb-1" :disabled="disabled" @click="click">
      <v-icon :name="icon(stdmsg)" /> {{ stdmsg.title }}
    </b-btn>
  </div>
</template>
<script>
import stdmsgs from '../mixins/stdmsgs'

export default {
  mixins: [stdmsgs],
  props: {
    stdmsg: {
      type: Object,
      required: true
    }
  }
}
</script>
