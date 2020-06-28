<template>
  <NoticeMessage v-if="showHelp" variant="info" class="mt-2 mb-2">
    <b-btn variant="white" class="float-right" @click="toggleHelp">
      Hide Help
    </b-btn>
    <p>
      These are members who have <b>used the same device for different members</b>.  By merging members who are
      really the same person, we can help them avoid confusion and missing messages.
    </p>
    <p>
      It suggests they're probably the same person if they have a similar name or email, and:
    </p>
    <ul>
      <li>they have groups in common, or</li>
      <li>they are both active on the same device on the same day</li>
    </ul>
    <p>
      If you don't think they're probably the same person, then click <em>Ignore</em>.
    </p>
    <p>
      If you think they're probably the same person, you can ask them what they want to do.  This will email them
      a mail like this:
    </p>
    <em>
      <p>
        We think you might have two separate accounts on Freegle, perhaps by mistake?
      </p>
      <p>
        Name1 (email1)<br>
        Name2 (email2)
      </p>
      <p>
        If these are both you, then you might miss replies or see other confusing things. Shall we combine them for you?
        If you don't recognise one of them, just ignore this email.
      </p>
      <b-btn variant="success" class="mb-2">
        Click here to let us know
      </b-btn>
    </em>
    <p>
      This takes them to a page where they can merge the accounts and decide which email address they prefer to use,
      or leave the two accounts separate.
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
