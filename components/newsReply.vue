<template>
  <div>
    <b-row>
      <b-col v-if="reply.userid && users[reply.userid]">
        <div>
          <b-img-lazy
            v-if="users[reply.userid].profile"
            rounded="circle"
            thumbnail
            class="profile p-0 ml-1 mb-1 inline float-left"
            alt="Profile picture"
            title="Profile"
            :src="users[reply.userid].profile.turl"
          />
          <div>
            <fa v-if="users[reply.userid].settings.showmod" icon="leaf" class="showmodsm text-success" />
            <span class="text-success font-weight-bold pl-2">
              {{ users[reply.userid].displayname }}
            </span>
            <span class="font-weight-bold prewrap replytext">{{ emessage }}</span>
          </div>
        </div>
      </b-col>
      <b-col v-else>
        <b-alert variant="danger" show>
          Unknown userid {{ reply.userid }} TODO this is a bug.
        </b-alert>
      </b-col>
    </b-row>
    <b-row v-if="reply.message && reply.userid && users[reply.userid]">
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
  /* TODO Indent second and subsequent lines of reply */
  font-size: 14px;
  line-height: 1.2;
}

.showmodsm {
  top: 14px;
  left: 32px;
  border-radius: 50%;
  position: absolute;
  background-color: white;
  width: 15px;
  padding-left: 3px;
  padding-top: 3px;
}
</style>
<script>
// TODO Click to show profile
// TODO User tagging
// TODO Love this function
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
