<template>
  <div v-if="textbody && textbody !== 'null'" v-line-clamp="2" class="textbody">
    <Highlighter
      v-if="matchedon"
      :search-words="[matchedon.word]"
      :text-to-highlight="textbody"
      highlight-class-name="highlight"
      auto-escape
    />
    <span v-else>{{ textbody }}</span>
  </div>
</template>
<script>
import twem from 'assets/js/twem'
import lineClamp from 'vue-line-clamp'
import Vue from 'vue'

Vue.use(lineClamp, {
  textOverflow: 'ellipsis'
})

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
}
</style>
