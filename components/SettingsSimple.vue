<template>
  <NoticeMessage variant="info">
    <div v-if="simple">
      <p>
        You are viewing the simple version of the site, so you won't see community features like ChitChat,
        community events or volunteer opportunities.  Some advanced settings won't show in this page.
      </p>
    </div>
    <div v-else>
      <p>
        You are viewing the full version of the site.  If you find this is too "busy", you can choose to view
        a simplified version.
      </p>
    </div>
    <p>
      You can toggle which version you see by clicking here:
    </p>
    <SimpleView />
  </NoticeMessage>
</template>
<script>
import NoticeMessage from './NoticeMessage'
import SimpleView from './SimpleView'
export default {
  components: { SimpleView, NoticeMessage }
}
</script>
