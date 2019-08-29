<template>
  <div v-if="notification.fromuser" class="clickme" @click="click">
    <div class="media clickme">
      <div class="media-left">
        <div class="media-object">
          <b-img-lazy
            rounded="circle"
            thumbnail
            class="profilesm p-0 ml-1 mb-1 mr-1"
            :alt="'Profile picture for ' + notification.fromuser.displayname"
            :src="notification.fromuser.profile.turl"
            @error.native="brokenImage"
          />
        </div>
      </div>
      <div class="media-body">
        <span class="notification-title"><span>{{ notification.fromuser.displayname }} loves your comment</span>
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
<script>
export default {
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  methods: {
    brokenImage(event) {
      event.target.src = '/static/defaultprofile.png'
    },
    click() {
      this.$router.push('/chitchat/' + this.notification.newsfeed.id)
    }
  }
}
</script>
