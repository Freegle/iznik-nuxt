<template>
  <NoticeMessage v-if="showHelp" variant="info" class="mt-2 mb-2">
    <b-btn variant="white" class="float-right" @click="toggleHelp">
      Hide Help
    </b-btn>
    <p>
      This is the information we get when people mark items as TAKEN or RECEIVED.  They can add comments, and if
      they're on the site they might click a happy/neutral/unhappy face to indicate how they're feeling.
    </p>
    <p>
      You might like to reply to the people who are unhappy.  Often just replying to them will make them feel
      better, even if you can't solve what they're unhappy about (for example if another freegler has let them
      down).
    </p>
    <p>
      Not everyone is unhappy!  We just show you those by default because they're the ones where you're most likely
      to want to do something.  You can use the dropdown filter to view the others.
    </p>
  </NoticeMessage>
  <b-btn v-else variant="link" class="float-right" @click="toggleHelp">
    Help
  </b-btn>
</template>
<script>
import NoticeMessage from './NoticeMessage'
import helpBox from '@/mixins/helpBox'

export default {
  components: { NoticeMessage },
  mixins: [helpBox],
  data: function() {
    return {
      id: 'feedback'
    }
  }
}
</script>
