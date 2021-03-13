<template>
  <NoticeMessage v-if="showHelp" variant="info" class="mt-2 mb-2">
    <b-btn variant="white" class="float-right" @click="toggleHelp">
      Hide Help
    </b-btn>
    <p>
      You'll see chat messages here for review if the recipient is a member of one of your groups.
    </p>
    <p>
      Read more about this on
      <!-- eslint-disable-next-line -->
      <ExternalLink href="https://wiki.ilovefreegle.org/Spammers#Chat_Review">the wiki</ExternalLink>.
    </p>
  </NoticeMessage>
  <b-btn v-else variant="link" class="float-right" @click="toggleHelp">
    Help
  </b-btn>
</template>
<script>
import helpBox from '@/mixins/helpBox'
import NoticeMessage from './NoticeMessage'
const ExternalLink = () => import('~/components/ExternalLink')

export default {
  components: { NoticeMessage, ExternalLink },
  mixins: [helpBox],
  data: function() {
    return {
      id: 'chatreview'
    }
  }
}
</script>
