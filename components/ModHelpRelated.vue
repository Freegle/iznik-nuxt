<template>
  <NoticeMessage v-if="showHelp" variant="info" class="mt-2 mb-2">
    <b-btn variant="white" class="float-right" @click="toggleHelp">
      Hide Help
    </b-btn>
    <p>
      These are members who have used the same device for different users.  By merging members who are
      really the same person, we can help them avoid confusion and missing messages.
    </p>
    <p>We think they're probably the same person if:</p>
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
      If we don't have reason to think they're probably the same person, then:
    </p>
    <ul>
      <li>Sleuthing is required using Support Tools.  </li>
      <li>
        If they are genuinely different users then we should ignore this report.
      </li>
    </ul>
    <p>If we think they are the same person, then we consider a merge:</p>
    <ul>
      <li>If they're both active on the same day, we suggest you ask them which they prefer.  We can't really decide.</li>
      <li>Otherwise we suggest merging into the most recently active.  That's probably the one with the most active email address.</li>
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
      id: 'related'
    }
  }
}
</script>
