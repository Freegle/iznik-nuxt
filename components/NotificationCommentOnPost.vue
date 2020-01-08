<template>
  <div v-if="notification.fromuser" class="clickme" @click="click">
    <div class="media clickme">
      <div class="media-left">
        <div class="media-object">
          <profile-image :image="notification.fromuser.profile.turl" class="mr-1 mb-1 ml-1 inline" is-thumbnail size="sm" />
        </div>
      </div>
      <div class="media-body">
        <span class="notification-title"><span>{{ notification.fromuser.displayname }} commented on your post</span>
          <span v-if="notification.newsfeed.message">
            <br>"<b>{{ notification.newsfeed.message }}</b>"
          </span>
        </span>
        <div class="notification-meta">
          <abbr class="small">{{ notification.timestamp|timeago }}</abbr>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const ProfileImage = () => import('~/components/ProfileImage')

export default {
  components: {
    ProfileImage
  },
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  methods: {
    click() {
      this.$router.push('/chitchat/' + this.notification.newsfeed.id)
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

li > a {
  padding-left: 0px;
}
</style>
