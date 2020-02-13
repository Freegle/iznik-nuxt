<template>
  <span>
    <span v-if="message.replycount" class="small text-muted mr-1">
      <v-icon name="user" class="d-inline" />&nbsp;<span class="d-inline">{{ message.replycount }}&nbsp;freegler<span v-if="message.replycount != 1">s</span>&nbsp;replied&nbsp;</span>
    </span>
    <span v-else class="small text-muted mr-1">
      <v-icon name="user" class="d-inline" /> No replies yet
    </span>
  </span>
</template>
<script>
export default {
  props: {
    message: {
      type: Object,
      required: true
    }
  }
}
</script>
