<template>
  <div class="clickme" @click="showModal">
    <div class="media clickme">
      <div class="media-left">
        <div class="media-object">
          <v-icon name="info-circle" scale="1.5" />
        </div>
      </div>
      <div class="media-body">
        <span class="notification-title"><span>Tell us about yourself!</span>
          <span>
            <br>"<b style="max-width: 200px; overflow-wrap: break-word">Click to introduce yourself to other freeglers by telling us a bit about you.  You'll get a better response and it makes freegling more fun.</b>"
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

.notification-title {
  max-width: 280px;
}
</style>
<script>
export default {
  components: {},
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  methods: {
    showModal() {
      this.$emit('showModal')
    }
  }
}
</script>
