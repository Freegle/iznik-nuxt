<template>
  <notice-message variant="warning">
    This item has already been promised to someone.  You can still reply - you might get it if someone
    else drops out.
  </notice-message>
</template>
<script>
import NoticeMessage from '@/components/NoticeMessage'

export default {
  components: { NoticeMessage }
}
</script>
