<template>
  <NoticeMessage v-if="showHelp" variant="info" class="mt-2 mb-2">
    <b-btn variant="white" class="float-right" @click="toggleHelp">
      Hide Help
    </b-btn>
    <p>
      We have some automated checks that spot unusual member behaviour.  Sometimes these will be people who are
      spammers/scammers, sometimes they may be overenthusiastic members who need a bit of guidance, and sometimes
      they may just be perfectly good members who just happen to be caught in the net.
    </p>
    <p>
      Please review their posting history and logs.  If you think they're a scammer/spammer, please use the button
      to report them.  If you think they are fine, then please add a mod Note so that other mods will see that too.
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
      id: 'memberreview'
    }
  }
}
</script>
