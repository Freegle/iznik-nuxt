<template>
  <div>
    <NoticeMessage v-if="unbounced" variant="warning" class="mb-2">
      We'll try sending them mail again to see if their email is still bouncing.
    </NoticeMessage>
    <NoticeMessage v-else variant="danger" class="mb-2">
      <p>
        <a :href="user.email">{{ user.email }}</a> is bouncing - see logs for details.
      </p>
      <div v-if="user.role === 'Member' || supportOrAdmin">
        <p>If you think the email is valid, you can:</p>
        <b-btn variant="white" @click="unbounce">
          <v-icon v-if="unbouncing" name="sync" class="fa-spin text-success" />
          <v-icon v-else-if="unbounced" name="check" class="text-success" />
          <v-icon v-else name="sync" />
          Reactivate
        </b-btn>
      </div>
      <div v-else>
        <!-- eslint-disable-next-line-->
        <p>You can't unbounce - you can only do this to members<span v-if="user.role">, and their role is {{ user.role }}</span>.</p>
      </div>
    </NoticeMessage>
  </div>
</template>
<script>
import NoticeMessage from './NoticeMessage'
export default {
  components: { NoticeMessage },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      unbouncing: false,
      unbounced: false
    }
  },
  methods: {
    async unbounce() {
      this.unbouncing = true

      await this.$store.dispatch('user/unbounce', {
        id: this.user.userid
      })

      this.unbouncing = false
      this.unbounced = true
    }
  }
}
</script>
