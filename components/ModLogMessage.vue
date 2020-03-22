<template>
  <span v-if="log.message">
    <a :href="'https://www.ilovefreegle.org/message/' + log.msgid" target="_blank">
      <v-icon name="hashtag" class="text-muted" scale="0.75" />{{ log.msgid }}
      <span v-if="log.message"><em>{{ messagesubject }}</em></span>
    </a>
    <span v-if="!notext && log.text && log.text.length > 0"> with <em>{{ log.text }} </em></span>
    <ModLogStdMsg :log="log" />
    <ModLogGroup :log="log" :tag="tag" />
  </span>
</template>
<script>
import ModLogGroup from './ModLogGroup'
import ModLogStdMsg from './ModLogStdMsg'
export default {
  components: { ModLogStdMsg, ModLogGroup },
  props: {
    log: {
      type: Object,
      required: false,
      default: null
    },
    notext: {
      type: Boolean,
      required: false,
      default: false
    },
    tag: {
      type: String,
      required: false,
      default: 'on'
    }
  },
  computed: {
    messagesubject() {
      if (this.log.message) {
        return this.log.message.subject
          ? this.log.message.subject
          : '(Blank subject line)'
      } else {
        return '(Message now deleted)'
      }
    }
  }
}
</script>
