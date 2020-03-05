<template>
  <NoticeMessage v-if="showHelp" variant="info" class="mt-2 mb-2">
    <b-btn variant="white" class="float-right" @click="toggleHelp">
      Hide Help
    </b-btn>
    <p>
      These are members who have used the same device for different users.  By merging members who are
      really the same person, we can help them avoid confusion and missing messages.
    </p>
    <p>It suggests they're probably the same person if:</p>
    <ul>
      <li>
        They have a similar name or email, and
      </li>
      <ul>
        <li>they have groups in common, or</li>
        <li>they are both active on the same device on the same day</li>
      </ul>
    </ul>
    <p>
      If you think they're probably the same person, you can ask them what they want to do.  This will email them
      and send them to a page on the site where they can choose how to merge their accounts.
    </p>
    <p>
      If you don't think they're probably the same person, then click <em>Ignore</em>.
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
      id: 'related'
    }
  }
}
</script>
