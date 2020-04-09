<template>
  <div class="text-danger small">
    Crosspost <v-icon name="hashtag" class="text-muted" scale="0.5" />{{ message.id }}
    <em>{{ message.subject }}</em>
    {{ message.timeago | timeago }} on <em>{{ message.groupname }}</em>
  </div>
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
