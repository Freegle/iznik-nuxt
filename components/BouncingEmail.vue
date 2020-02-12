<template>
  <b-row>
    <b-col cols="12" xl="6" offset-xl="3" class="bottom">
      <NoticeMessage v-if="me && me.bouncing" variant="danger">
        <v-icon name="exclamation-triangle" />
        We can't send to your email address.  Please go to <nuxt-link to="/settings">
          Settings
        </nuxt-link> to fix or retry.
      </NoticeMessage>
    </b-col>
  </b-row>
</template>
<script>
import NoticeMessage from '../components/NoticeMessage'

export default {
  components: {
    NoticeMessage
  },
  computed: {
    me() {
      return this.$store.getters['auth/user']
    }
  }
}
</script>
<style scoped>
.bottom {
  position: fixed;
  bottom: 0%;
}
</style>
