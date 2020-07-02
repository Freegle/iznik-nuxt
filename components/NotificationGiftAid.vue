<template>
  <div class="clickme" @click="goto">
    <div class="media clickme">
      <div class="media-left">
        <div class="media-object">
          <v-icon name="info-circle" scale="1.5" />
        </div>
      </div>
      <div class="media-body">
        <span class="notification-title"><span>Thank you for donating to Freegle!</span>
          <span>
            <br><b class="introduction">Your kind donation can go even further if you complete a Gift Aid Declaration.  Please click here.</b>
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
  components: {},
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  methods: {
    goto() {
      if (!this.notification.seen) {
        this.$store.dispatch('notifications/seen', {
          id: this.notification.id
        })
      }

      this.$router.push('/giftaid')
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

.introduction {
  max-width: 200px;
  overflow-wrap: break-word;
}
</style>
