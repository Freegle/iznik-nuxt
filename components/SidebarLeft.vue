<template>
  <div v-if="!simple" class="d-flex flex-column sidebar__wrapper">
    <BotLeftBox v-if="showBotLeft" class="social-media__wrapper flex-shrink-2" />
  </div>
</template>

<script>
const BotLeftBox = () => import('~/components/BotLeftBox')

export default {
  components: {
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
</style>
