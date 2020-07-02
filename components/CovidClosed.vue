<template>
  <NoticeMessage variant="danger">
    <transition name="fade">
      <p>
        Your local Freegle community is currently closed due to COVID-19.  Your local volunteers have
        made this difficult decision to try to keep you safe.  Please respect it, and we hope you'll come
        back when the situation changes.
      </p>
    </transition>
  </NoticeMessage>
</template>
<script>
import NoticeMessage from './NoticeMessage'
export default {
  components: { NoticeMessage }
}
</script>
