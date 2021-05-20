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
    <span v-else class="prewrap forcebreak font-weight-bold">{{ safeBody }}</span>
  </div>
</template>
<script>
import twem from 'assets/js/twem'

const Highlighter = () => import('vue-highlight-words')

export default {
  components: { Highlighter },
  props: {
    id: {
      type: Number,
      required: true
    },
    messageOverride: {
      type: Object,
      required: false,
      default: null
    }
  },
  computed: {
    message() {
      return (
        this.messageOverride ?? this.$store.getters['messages/get'](this.id)
      )
    },
    safeBody() {
      return twem.twem(this.$twemoji, this.message.textbody)
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.highlight {
  color: $color-orange--dark;
  background-color: initial;
  padding: 0;
}
</style>
