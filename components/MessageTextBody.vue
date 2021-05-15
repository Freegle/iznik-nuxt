<template>
  <div>
    <Highlighter
      v-if="message.matchedon"
      :search-words="[message.matchedon.word]"
      :text-to-highlight="message.textbody"
      highlight-class-name="highlight"
      auto-escape
      class="prewrap"
    />
    <span v-else class="prewrap forcebreak">{{ message.textbody }}</span>
  </div>
</template>
<script>
const Highlighter = () => import('vue-highlight-words')

export default {
  components: { Highlighter },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    message() {
      return this.$store.getters['messages/get'](this.id)
    }
  }
}
</script>
