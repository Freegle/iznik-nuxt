<template>
  <div v-if="notification.fromuser" class="clickme">
    <div class="media clickme">
      <div class="media-left">
        <div class="media-object">
          <ProfileImage :image="notification.fromuser.profile.turl" class="mr-1 mb-1 ml-1 inline" is-thumbnail size="sm" />
        </div>
      </div>
      <div class="media-body">
        <span class="notification-title"><span>{{ notification.fromuser.displayname }} commented </span>
          <span v-if="notification.newsfeed.message" class="forcebreak">
            <br>"<span class="notification__message font-weight-bold">{{ notification.newsfeed.message }}</span>"
          </span>
        </span>
        <div class="notification-meta">
          <abbr class="small">{{ timeago(notification.timestamp) }}</abbr>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileImage from '~/components/ProfileImage'

export default {
  components: {
    ProfileImage
  },
  props: {
    notification: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.media-object {
  width: 33px;
  height: 28px;
  padding-top: 5px;
}

.notification-title {
  max-width: 280px;
}

.notification__message {
  max-width: 200px;
  overflow-wrap: break-word;
}
</style>
