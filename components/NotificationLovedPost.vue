<template>
  <div v-if="notification.fromuser">
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
        <span v-if="notification.newsfeed.type == 'Noticeboard'" class="notification-title"><span>{{ notification.fromuser.displayname }} loves your poster</span>
          <span v-if="noticeboard && noticeboard.name">&quot;<b>{{ noticeboard.name }}</b>&quot;</span>
        </span>
        <span v-else>
          <span class="notification-title"><span>{{ notification.fromuser.displayname }} loves your post</span>
            <span v-if="notification.newsfeed.message">
              "{{ notification.newsfeed.message }}"
            </span>
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
    }
  }
}
</script>
