<template>
  <b-card class="p-0 mb-1" variant="success">
    <b-card-header class="pl-2 pr-2">
      <b-card-title class="msgsubj">
        {{ safeSubject }}
      </b-card-title>
    </b-card-header>
  </b-card>
</template>
<script>
import sanitizeHtml from 'sanitize-html'

export default {
  props: {
    id: {
      type: Number,
      default: 0
    },
    subject: {
      type: String,
      default: null
    }
  },
  computed: {
    safeSubject() {
      return sanitizeHtml(this.subject)
    }
  }
}
</script>
<style>
.card-body {
  padding: 0px;
}
</style>
