<template>
  <div>
    <Highlighter
      :search-words="searchWords"
      :text-to-highlight="formattedString"
      highlight-class-name="highlight"
      class="nopara"
    />

    <span v-show="text.length > maxChars">
      <a v-show="!isReadMore" id="readmore" class="highlight" :href="link" @click="triggerReadMore($event, true)">{{ moreStr }}</a>
      <a v-show="isReadMore" id="readmore" class="highlight" :href="link" @click="triggerReadMore($event, false)">{{ lessStr }}</a>
    </span>
  </div>
</template>

<style scoped lang="scss">
@import 'color-vars';

.highlight {
  color: $color-blue--alt;
  background-color: initial;
}
</style>

<script>
// Originally based on https://github.com/orlyyani/read-more
const Highlighter = () => import('vue-highlight-words')

export default {
  components: {
    Highlighter
  },
  props: {
    moreStr: {
      type: String,
      default: 'read more'
    },
    lessStr: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      required: true
    },
    link: {
      type: String,
      default: '#'
    },
    maxChars: {
      type: Number,
      default: 100
    },
    searchWords: {
      type: Array,
      required: true
    },
    highlightClassName: {
      type: String,
      required: false,
      default: 'highlight'
    }
  },

  data() {
    return {
      isReadMore: false
    }
  },

  computed: {
    formattedString() {
      let valContainer = this.text

      if (!this.isReadMore && this.text && this.text.length > this.maxChars) {
        valContainer = valContainer.substring(0, this.maxChars) + '...'
      }

      return valContainer
    }
  },

  methods: {
    triggerReadMore(e, b) {
      if (this.link === '#') {
        e.preventDefault()
      }
      if (this.lessStr !== null || this.lessStr !== '') this.isReadMore = b
    }
  }
}
</script>
