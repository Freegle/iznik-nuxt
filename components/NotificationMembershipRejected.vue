<template>
  <div class="clickme">
    <div class="media clickme">
      <div class="media-left">
        <div class="media-object">
          <v-icon name="info-circle" scale="2" />
        </div>
      </div>
      <div class="media-body">
        <span class="notification-title"><span>Sorry, your application was rejected</span>
          <span />
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

.notification-title {
  max-width: 280px;
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
  methods: {}
}
</script>
