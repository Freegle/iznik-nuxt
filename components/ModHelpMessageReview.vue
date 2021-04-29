<template>
  <NoticeMessage v-if="showHelp" variant="info" class="mt-2 mb-2">
    <b-btn variant="white" class="float-right" @click="toggleHelp">
      Hide Help
    </b-btn>
    <p>
      These are messages which need checking to make sure they're not spam or scam.
    </p>
    <p>
      Once you've checked for that, the message will be moved back to Pending/Approved as appropriate.  Then you'll see
      the standard message buttons, in case you want to follow up on something.
    </p>
    <p>
      <!-- eslint-disable-next-line-->
      Read about spammers <ExternalLink href="https://wiki.ilovefreegle.org/Spammers">on the wiki</ExternalLink>.
    </p>
  </NoticeMessage>
  <b-btn v-else variant="link" class="float-right" @click="toggleHelp">
    Help
  </b-btn>
</template>
<script>
import helpBox from '@/mixins/helpBox'
import NoticeMessage from './NoticeMessage'
import ExternalLink from '~/components/ExternalLink'

export default {
  components: { ExternalLink, NoticeMessage },
  mixins: [helpBox],
  data: function() {
    return {
      id: 'messagereview'
    }
  }
}
</script>
