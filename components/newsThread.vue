<template>
  <div class="bg-white">
    <b-card>
      <b-card-text>
        <b-row>
          <b-col v-if="newsfeed.userid">
            <div>
              <b-img-lazy
                rounded="circle"
                thumbnail
                class="profile p-0 ml-1 mb-1 inline float-left"
                alt="Profile picture"
                title="Profile"
                :src="users[newsfeed.userid].profile.turl"
              />
              <span class="text-success font-weight-bold pl-2">
                {{ users[newsfeed.userid].displayname }}
              </span>
              <br>
              <span class="text-muted small pl-2">
                {{ $moment(newsfeed.timestamp).fromNow() }}
              </span>
              <newsUserInfo :user="users[newsfeed.userid]" />
            </div>
          </b-col>
        </b-row>
        <b-row v-if="newsfeed.message">
          <b-col>
            <span class="font-weight-bold prewrap">{{ newsfeed.message }}</span>
          </b-col>
        </b-row>
      </b-card-text>
    </b-card>
  </div>
</template>
<style scoped>
.profile {
  width: 50px !important;
  height: 50px !important;
}
</style>
<script>
// TODO Click to show profile
import twem from '~/assets/js/twem'
import newsUserInfo from '~/components/newsUserInfo'

export default {
  components: {
    newsUserInfo
  },
  props: {
    newsfeed: {
      type: Object,
      required: true
    },
    users: {
      type: Object,
      required: true
    }
  },
  computed: {
    emessage() {
      return this.newsfeed.message
        ? twem.twem(this.$twemoji, this.newsfeed.message)
        : null
    }
  }
}
</script>
