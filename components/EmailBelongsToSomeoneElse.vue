<template>
  <NoticeMessage>
    <p>
      You are logged in
      <span v-if="ours">
        with <strong>{{ ours }}</strong>
      </span>,
      but <strong>{{ theirs }}</strong> belongs to another account.
    </p>
    <p>
      If they are both yours, you can ask the volunteers to merge your accounts from <em>Help</em>.
    </p>
  </NoticeMessage>
</template>
<script>
import NoticeMessage from './NoticeMessage'
export default {
  components: { NoticeMessage },
  props: {
    ours: {
      type: String,
      required: true
    },
    theirs: {
      type: String,
      required: true
    }
  }
}
</script>
