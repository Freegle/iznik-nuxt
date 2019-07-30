<template>
  <div class="bg-white">
    <b-card>
      <b-card-text>
        <b-row>
          <b-col v-if="newsfeed.userid">
            <div>
              <b-img-lazy
                v-if="users[newsfeed.userid].profile.turl"
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
      <div v-if="newsfeed.replies.length > 0" slot="footer">
        <ul v-for="(entry, $index) in newsfeed.replies" :key="'newsfeed-' + $index" class="p-0 pt-1 list-unstyled mb-1">
          <li>
            <newsReply :key="'newsfeedreply-' + newsfeed.id + '-reply-' + entry.id" :reply="entry" :users="users" />
          </li>
        </ul>
      </div>
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
import newsReply from '~/components/newsReply'

export default {
  components: {
    newsUserInfo,
    newsReply
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
