<template>
  <div class="d-flex flex-column sidebar__wrapper">
    <CommunityEventSidebar v-if="showCommunityEvents" class="flex-grow-1" style="overflow-y: auto" />
    <BotLeftBox v-if="showBotLeft" class="social-media__wrapper flex-shrink-2" />
  </div>
</template>

<script>
const CommunityEventSidebar = () => import('~/components/CommunityEventSidebar')
const BotLeftBox = () => import('~/components/BotLeftBox')

export default {
  components: {
    CommunityEventSidebar,
    BotLeftBox
  },
  props: {
    showCommunityEvents: {
      type: Boolean,
      required: true
    },
    showBotLeft: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped>
.social-media__wrapper {
  margin-top: auto;
}
</style>
