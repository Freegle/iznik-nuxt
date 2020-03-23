<template>
  <div class="clickme">
    <div class="media clickme">
      <div class="media-left">
        <div class="media-object">
          <v-icon name="heart" scale="2" />
        </div>
      </div>
      <div class="media-body pl-1">
        <span class="notification-title"><span>{{ notification.title }}</span>
          <span v-if="notification.text">
            <br>"<b class="notification__message">{{ notification.text }}</b>"
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
      event.target.src = require('~/static/defaultprofile.png')
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
