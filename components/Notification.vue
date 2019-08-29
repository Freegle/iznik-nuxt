<template>
  <div style="white-space: normal" @click="click">
    <notification-loved-post v-if="notification.type === 'LovedPost'" :notification="notification" />
    <notification-loved-comment v-else-if="notification.type === 'LovedComment'" :notification="notification" />
    <notification-comment-on-post v-else-if="notification.type === 'CommentOnYourPost'" :notification="notification" />
    <notification-comment-on-comment v-else-if="notification.type === 'CommentOnCommented'" :notification="notification" />
    <notification-exhort v-else-if="notification.type === 'Exhort'" :notification="notification" />
    <span v-else>
      Unknown notification {{ notification.type }}
    </span>
  </div>
</template>
<script>
import NotificationLovedPost from '~/components/NotificationLovedPost'
import NotificationLovedComment from '~/components/NotificationLovedComment'
import NotificationCommentOnPost from '~/components/NotificationCommentOnPost'
import NotificationCommentOnComment from '~/components/NotificationCommentOnComment'
import NotificationExhort from '~/components/NotificationExhort'

export default {
  components: {
    NotificationLovedPost,
    NotificationLovedComment,
    NotificationCommentOnPost,
    NotificationCommentOnComment,
    NotificationExhort
    // TODO Others
  },
  inheritAttrs: false,
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  methods: {
    click() {
      if (this.notification.url) {
        window.open(this.notification.url)
      } else if (this.notification.newsfeed) {
        this.$router.push('/chitchat/' + this.notification.newsfeed.id)
      }
    }
  }
}
</script>
