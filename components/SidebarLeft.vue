<template>
  <div v-if="!simple" class="sidebar__wrapper maxheight d-flex flex-column justify-content-between">
    <div>
      <CommunityEventSidebar v-if="showCommunityEvents && false" class="flex-grow-1 sidebar__community-event" />
    </div>
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

.sidebar__community-event {
  overflow-y: auto;
}

.maxheight {
  max-height: calc(100vh - 78px);
}
</style>
