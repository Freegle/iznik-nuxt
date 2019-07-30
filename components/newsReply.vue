<template>
  <div>
    <b-row>
      <b-col v-if="reply.userid">
        <div>
          <b-img-lazy
            v-if="users[reply.userid] && users[reply.userid].profile"
            rounded="circle"
            thumbnail
            class="profile p-0 ml-1 mb-1 inline float-left"
            alt="Profile picture"
            title="Profile"
            :src="users[reply.userid].profile.turl"
          />
          <span class="text-success font-weight-bold pl-2">
            {{ users[reply.userid].displayname }}
          </span>
          <span class="font-weight-bold prewrap replytext">{{ reply.message }}</span>
        </div>
      </b-col>
    </b-row>
    <b-row v-if="reply.message">
      <b-col class="pl-8">
        <span class="text-muted small pl-4">
          {{ $moment(reply.timestamp).fromNow() }}
        </span>
        <newsUserInfo :user="users[reply.userid]" />
      </b-col>
    </b-row>
    <div v-if="reply.replies && reply.replies.length > 0" class="pl-2">
      <ul v-for="(entry, $index) in replies" :key="'newsfeed-' + $index" class="p-0 pt-1 list-unstyled mb-1">
        <li>
          <newsReply :key="'newsfeedreply-' + reply.id + '-reply-' + entry.id" :reply="entry" :users="users" />
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.profile {
  width: 25px !important;
  height: 25px !important;
}

.replytext {
  font-size: 14px;
  line-height: 1.2;
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
    reply: {
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
      return this.reply.message
        ? twem.twem(this.$twemoji, this.reply.message)
        : null
    }
  }
}
</script>
