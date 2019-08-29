<template>
  <div>
    <notification-loved-post v-if="notification.type === 'LovedPost'" :notification="notification" />
    <v-else>
      Unknown notification {{ notification.type }}
    </v-else>
  </div>
</template>
<script>
import NotificationLovedPost from '~/components/NotificationLovedPost'

export default {
  components: {
    NotificationLovedPost
  },
  inheritAttrs: false,
  props: {
    notification: {
      type: Object,
      required: true
    }
  }
}
</script>
