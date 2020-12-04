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
      Please review their posting history and logs.
    </p>
    <p>
      You may or may not want to do something about them on your group:
    </p>
    <ul>
      <li>
        If you do, click the link to go to their membership on your group.
      </li>
      <li>
        From there you can remove them, ban them, send them a message, whatever.
      </li>
      <li>
        You can add a Mod Note to show other mods what you've decided or done.
      </li>
      <li>
        At some point you may be able to do some of that from here - but not yet.
      </li>
    </ul>
    <p>
      Please also make a decision about them on this page:
    </p>
    <ul>
      <li>
        If you think they are a spammer/scammer, click the <em>Spammer</em> button to report them.
      </li>
      <li>
        If you don't think they are a spammer/scammer, then click the <em>Not a Spammer</em> button.
      </li>
    </ul>
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
