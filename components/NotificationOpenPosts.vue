<template>
  <div class="clickme" @click="goto">
    <div class="media clickme">
      <div class="media-left">
        <div class="media-object">
          <v-icon name="question-circle" scale="1.5" />
        </div>
      </div>
      <div class="media-body">
        <div class="notification-title">
          You have {{ notification.text | pluralize('recent open post', { includeNumber: true }) }}
        </div>
        <div class="font-weight-bold introduction">
          What happened?  Use <em>My Posts</em> to let us know.
        </div>
        <ul class="small pl-3">
          <li>
            Mark <em>OFFERs</em> as <em>TAKEN</em>.
          </li>
          <li>
            Click <em>Withdraw</em> if no longer active.
          </li>
          <li>
            Click <em>Repost</em> to keep trying.
          </li>
        </ul>
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

      this.$router.push('/myposts')
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
