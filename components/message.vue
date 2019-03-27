<template>
  <b-card bg-light>
    <b-row>
      <b-col>
        {{ safeSubject }}
      </b-col>
    </b-row>
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
