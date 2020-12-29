<template>
  <NoticeMessage v-if="showHelp" variant="info" class="mt-2 mb-2">
    <b-btn variant="white" class="float-right" @click="toggleHelp">
      Hide Help
    </b-btn>
    <p>
      These are the microvolunteering actions that your members have taken.  If it's about a particular message
      you can click on the subject or photo to go to the relevant message.
    </p>
    <p>
      You will see something in here if the person who did it is a member of one of your communities (even if what they
      did was about another community).
    </p>
  </NoticeMessage>
  <b-btn v-else variant="link" class="float-right" @click="toggleHelp">
    Help
  </b-btn>
</template>
<script>
import helpBox from '@/mixins/helpBox'
import NoticeMessage from './NoticeMessage'

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
