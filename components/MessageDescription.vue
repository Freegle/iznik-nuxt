<template>
  <div v-if="textbody && textbody !== 'null'" v-line-clamp="clamp" class="textbody">
    <Highlighter
      v-if="me && matchedon"
      :search-words="[matchedon.word]"
      :text-to-highlight="textbody"
      highlight-class-name="highlight"
      auto-escape
    />
    <span v-else itemprop="description">{{ textbody }}</span>
  </div>
</template>
<script>
import twem from 'assets/js/twem'
import Vue from 'vue'

if (process.client) {
  const lineClamp = require('vue-line-clamp')

  Vue.use(lineClamp, {
    textOverflow: 'ellipsis'
  })
}

const Highlighter = () => import('vue-highlight-words')

export default {
  components: { Highlighter },
  props: {
    id: {
      type: Number,
      required: true
    },
    matchedon: {
      type: Object,
      required: false,
      default: null
    }
  },
  computed: {
    clamp() {
      if (this.me) {
        return 2
      } else {
        return 10
      }
    },
    message() {
      return this.$store.getters['messages/get'](this.id)
    },
    textbody() {
      return this.message
        ? twem.twem(this.$twemoji, this.message.textbody)
        : null
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.textbody {
  font-size: 1.25rem;
  word-break: break-word !important;
}
</style>
