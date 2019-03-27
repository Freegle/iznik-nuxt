<template>
  <b-card class="p-0 mb-1" variant="success">
    <b-card-header class="pl-2 pr-2">
      <b-card-title class="msgsubj mb-0">
        {{ safeSubject }}
      </b-card-title>
      <span v-for="group in groups" :key="id + '-' + group.id" class="small muted">
        {{ group.arrival | timeago }} on {{ group.namedisplay }}
      </span>
      <div v-if="safeSnippet">
        <h4>{{ safeSnippet }}...</h4>
      </div>
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
    },
    textbody: {
      type: String,
      default: null
    },
    snippet: {
      type: String,
      default: null
    },
    groups: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    safeSubject() {
      return sanitizeHtml(this.subject)
    },
    safeBody() {
      return sanitizeHtml(this.textbody)
    },
    safeSnippet() {
      return sanitizeHtml(this.snippet)
    }
  }
}
</script>
<style>
.card-body {
  padding: 0px;
}

h4 {
  color: black !important;
}
</style>
