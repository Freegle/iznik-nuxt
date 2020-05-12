<template>
  <div class="text-danger small">
    Duplicate of <v-icon name="hashtag" class="text-muted" scale="0.5" /><nuxt-link :to="'/modtools/message/' + message.id">
      {{ message.id }}
    </nuxt-link>
    <em>{{ message.subject }}</em>
    {{ message.arrival | timeago }}
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
