<template>
  <div class="text-danger small">
    Duplicate of <v-icon name="hashtag" class="text-muted" scale="0.5" /><nuxt-link :to="'/modtools/message/' + message.id">
      {{ message.id }}
    </nuxt-link>
    <em>{{ message.subject }}</em>
    {{ timeago(message.arrival) }}
    <span v-if="message.outcome">, now {{ message.outcome }}</span><span v-else>, still open</span>
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
