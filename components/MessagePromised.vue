<template>
  <div>
    <notice-message v-if="!toMe" variant="warning">
      This item has already been promised to someone.  You can still reply - you might get it if someone
      else drops out.
    </notice-message>
    <notice-message v-else variant="primary">
      This has  been promised to you.
    </notice-message>
  </div>
</template>
<script>
import NoticeMessage from '@/components/NoticeMessage'

export default {
  components: { NoticeMessage },
  props: {
    toMe: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>
