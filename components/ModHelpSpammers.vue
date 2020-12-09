<template>
  <NoticeMessage v-if="showHelp" variant="info" class="mt-2 mb-2">
    <b-btn variant="white" class="float-right" @click="toggleHelp">
      Hide Help
    </b-btn>
    <p>
      Spammer reports are reviewed before a member appears on the list.  Once someone is on this list, they will
      automatically be removed from communities unless you've disabled
      that in Settings.  If you think someone is on this list wrongly, you can request that they be removed using
      the button below.
    </p>

    <p>
      Whitelisted people are those who have good reasons to join many groups, who we flag up so that you don't
      accidentally think they're spammers.
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
      id: 'publicity'
    }
  }
}
</script>
