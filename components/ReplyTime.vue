<template>
  <div>
    <p v-if="replytime">
      <v-icon name="clock" class="fa-fw" /> Typically replies in {{ replytime }}.
    </p>
    <p v-else>
      <v-icon name="clock" class="fa-fw" /> We don't know how long they typically take to reply.
    </p>
  </div>
</template>
<script type="module">
import 'vue-awesome/icons/clock'
</script>
<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    replytime() {
      if (this.user && this.user.info && this.user.info.replytime) {
        let ret
        const secs = this.user.info.replytime

        if (secs < 60) {
          ret = Math.round(secs) + ' second'
        } else if (secs < 60 * 60) {
          ret = Math.round(secs / 60) + ' minute'
        } else if (secs < 24 * 60 * 60) {
          ret = Math.round(secs / 60 / 60) + ' hour'
        } else {
          ret = Math.round(secs / 60 / 60 / 24) + ' day'
        }

        if (ret.indexOf('1 ') !== 0) {
          ret += 's'
        }

        return ret
      }

      return null
    }
  }
}
</script>
