<template>
  <div v-if="notification.fromuser" class="clickme" @click="click">
    <div class="media clickme">
      <div class="media-left">
        <div class="media-object">
          <ProfileImage :image="notification.fromuser.profile.turl" class="mr-1 mb-1 ml-1 inline" is-thumbnail size="sm" />
        </div>
      </div>
      <div v-if="notification.newsfeed" class="media-body">
        <span v-if="notification.newsfeed.type == 'Noticeboard'" class="notification-title"><span>{{ notification.fromuser.displayname }} loves your poster</span>
          <span v-if="notification.noticeboard && notification.noticeboard.name">&quot;<strong>{{ notification.noticeboard.name }}</strong>&quot;</span>
        </span>
        <span v-else>
          <span class="notification-title"><span>{{ notification.fromuser.displayname }} loves your post</span>
            <span v-if="notification.newsfeed.message" class="forcebreak font-weight-bold">
              <br>"{{ notification.newsfeed.message }}"
            </span>
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
