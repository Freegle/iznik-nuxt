<template>
  <div class="d-flex flex-column sidebar__wrapper">
    <CommunityEventSidebar class="justify-content-start flex-grow-1" style="overflow-y: auto" />
    <BotLeftBox class="justify-content-end flex-shrink-2" />
  </div>
</template>

<script>
const CommunityEventSidebar = () => import('~/components/CommunityEventSidebar')
const BotLeftBox = () => import('~/components/BotLeftBox')

export default {
  components: {
    CommunityEventSidebar,
    BotLeftBox
  }
}
</script>

<style scoped>
.sidebar__wrapper {
  height: calc(100vh - 100px);
}
</style>
