<template>
  <NoticeMessage :variant="user.spammer.collection === 'Whitelisted' ? 'success' : 'warning'" class="mb-1">
    <div>
      {{ user.spammer.collection }}: {{ user.spammer.reason }}
    </div>
    <div class="small">
      Added by #{{ user.spammer.byuserid }} {{ user.spammer.added | timeago }}
    </div>
  </NoticeMessage>
</template>
<script>
import NoticeMessage from './NoticeMessage'
export default {
  components: { NoticeMessage },
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>
