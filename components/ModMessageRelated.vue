<template>
  <div class="text-success small">
    Related to <v-icon name="hashtag" class="text-muted" scale="0.5" />{{ message.id }}
    <em>{{ message.subject }}</em>
    {{ timeago(message.arrival) }}
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
