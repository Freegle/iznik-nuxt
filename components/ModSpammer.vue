<template>
  <NoticeMessage :variant="variant" class="mb-1">
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
  },
  computed: {
    variant() {
      switch (this.user.spammer.collection) {
        case 'Spammer': {
          return 'danger'
        }
        case 'Whitelisted': {
          return 'success'
        }
        default: {
          return 'warning'
        }
      }
    }
  }
}
</script>
