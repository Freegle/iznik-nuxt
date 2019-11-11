<template>
  <div class="d-flex flex-column sidebar__wrapper">
    <CommunityEventSidebar v-if="showCommunityEvents" class="justify-content-start flex-grow-1" style="overflow-y: auto" />
    <BotLeftBox v-if="showBotLeft" class="justify-content-end flex-shrink-2" />
    <!--    TODO DESIGN If you set the events not to show, as on /mobile page, then the box appears wrongly at the top of the screen-->
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
.sidebar__wrapper {
  height: calc(100vh - 100px);
}
</style>
