<template>
  <div class="item header--size4">
    <h3 class="m-0 d-flex justify-content-between">
      <div>
        <div class="sr-only">
          {{ type }}
        </div>
        <Highlighter
          v-if="matchedon"
          :search-words="[matchedon.word]"
          :text-to-highlight="item"
          highlight-class-name="highlight"
          auto-escape
          class="item"
        />
        <span v-else class="item">
          {{ item }}
        </span>
      </div>
      <b-badge v-if="message.availablenow > 1" variant="info" class="ml-3">
        {{ message.availablenow ? message.availablenow : '0' }} left
      </b-badge>
    </h3>
    <div class="location">
      {{ location }}
    </div>
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
    matchedon: {
      type: Object,
      required: false,
      default: null
    },
    type: {
      type: String,
      required: false,
      default: null
    }
  },
  computed: {
    message() {
      return this.$store.getters['messages/get'](this.id)
    },
    subject() {
      return this.message ? this.message.subject : null
    },
    item() {
      let ret = this.subject

      if (this.subject) {
        const matches = /(.*?):([^)].*)\((.*)\)/.exec(this.subject)

        if (matches && matches.length > 0 && matches[2].length > 0) {
          ret = matches[2]
        }
      }

      return ret ? twem.twem(this.$twemoji, ret) : null
    },
    location() {
      let ret = null

      if (this.subject) {
        const matches = /(.*?):([^)].*)\((.*)\)/.exec(this.subject)

        if (matches && matches.length > 0 && matches[3].length > 0) {
          ret = matches[3]
        }
      }

      return ret ? twem.twem(this.$twemoji, ret) : null
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

.item {
  color: $colour-info-fg !important;
  font-weight: bold !important;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: block;
}

.location {
  color: $color-gray--darker !important;
  font-size: 1.25rem;
}
</style>
