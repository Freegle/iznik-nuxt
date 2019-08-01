<template>
  <div>
    <b-row>
      <b-col v-if="reply.userid && users[reply.userid]">
        <table v-if="users[reply.userid].profile">
          <tbody>
            <tr>
              <td>
                <b-img-lazy
                  rounded="circle"
                  class="profilemd p-0 ml-1 mb-1 mr-2 inline float-left"
                  alt="Profile picture"
                  title="Profile"
                  :src="users[reply.userid].profile.turl"
                />
              </td>
              <td>
                <fa v-if="users[reply.userid].settings.showmod" icon="leaf" class="showmodsm text-success" />
                <span class="text-success font-weight-bold">{{ users[reply.userid].displayname }}</span>
                <span class="font-weight-bold prewrap replytext">{{ emessage }}</span>
                <span v-if="reply.message && reply.userid && users[reply.userid]">
                  <br>
                  <span class="text-muted small">
                    {{ $moment(reply.timestamp).fromNow() }}
                  </span>
                  <NewsUserInfo :user="users[reply.userid]" />
                  <span v-if="!threadhead.closed">
                    &bull;<span class="text-muted small clickme" @click="replyReply">&nbsp;Reply</span>
                  </span>
                  <span class="text-muted small clickme">
                    <span v-if="!reply.loved" @click="love">
                      &bull;&nbsp;Love this
                    </span>
                    <span v-if="reply.loved" @click="unlove">
                      &bull;&nbsp;Unlove this
                    </span>
                    <span v-if="reply.loves">
                      <fa icon="heart" class="text-danger" />&nbsp;{{ reply.loves }}
                    </span>
                  </span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>
      <b-col v-else>
        <b-alert variant="danger" show>
          Unknown userid {{ reply.userid }} TODO this is a bug.
        </b-alert>
      </b-col>
    </b-row>
    <div v-if="reply.replies && reply.replies.length > 0" class="pl-3">
      <ul v-for="(entry, $index) in reply.replies" :key="'newsfeed-' + $index" class="p-0 pt-1 pl-1 list-unstyled mb-1 border-left">
        <li>
          <news-reply :key="'newsfeedreply-' + reply.id + '-reply-' + entry.id" :reply="entry" :users="users" />
        </li>
      </ul>
    </div>
    <b-row v-if="showReplyBox">
      <b-col>
        <b-input-group class="pl-4">
          <b-input-group-prepend>
            <span class="input-group-text pl-1 pr-1">
              <b-img-lazy
                v-if="me.profile.turl"
                rounded="circle"
                thumbnail
                class="profilesm p-0 m-0 inline float-left"
                alt="Profile picture"
                title="Profile"
                :src="me.profile.turl"
              />
            </span>
          </b-input-group-prepend>
          <b-textarea
            ref="replybox"
            v-model="replybox"
            size="sm"
            rows="1"
            max-rows="8"
            maxlength="2048"
            spellcheck="true"
            placeholder="Write a reply..."
            class="p-0 pl-1 pt-1"
            @keydown.enter.exact.prevent
            @keyup.enter.exact="sendReply"
            @keydown.enter.shift.exact="newlineReply"
            @keydown.alt.shift.exact="newlineReply"
            @focus="focusedReply"
          />
        </b-input-group>
      </b-col>
      <b-col cols="1" class="p-0">
        <b-btn size="sm" variant="primary" class="float-right">
          <fa icon="camera" />&nbsp;Photo
        </b-btn>
      </b-col>
    </b-row>
  </div>
</template>
<style scoped>
.replytext {
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
// TODO Delete
// TODO Edit
import twem from '~/assets/js/twem'
import NewsUserInfo from '~/components/NewsUserInfo'

export default {
  name: 'NewsReply',
  components: {
    NewsUserInfo
  },
  props: {
    threadhead: {
      type: Object,
      required: true
    },
    reply: {
      type: Object,
      required: true
    },
    users: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      showReplyBox: false,
      replyingTo: null,
      replybox: null
    }
  },
  computed: {
    me() {
      return this.$store.state.auth.user
    },
    emessage() {
      return this.reply.message
        ? twem.twem(this.$twemoji, this.reply.message)
        : null
    }
  },
  methods: {
    replyReply() {
      this.replyingTo = this.reply.id
      this.showReplyBox = true

      // Can't set focus immediately as not in DOM until re-render.
      this.$nextTick(() => {
        console.log('Reply', this.$refs)
        this.$refs.replybox.focus()
      })
    },
    focusReply: function() {
      this.$refs.replybox.focus()
    },
    focusedReply: function() {
      this.replyingTo = this.reply.id
    },
    async sendReply() {
      // Encode up any emojis.
      if (this.replybox) {
        const msg = twem.untwem(this.replybox)

        await this.$store.dispatch('newsfeed/send', {
          message: msg,
          replyto: this.replyingTo,
          threadhead: this.reply.threadhead
        })

        // New message will be shown because it's in the store and we have a computed property.

        // Clear and hide the textarea now it's sent.
        this.replybox = null
        this.showReplyBox = false
      }
    },
    newlineComment() {
      this.replybox += '\n'
    },
    love() {
      this.$store.dispatch('newsfeed/love', {
        id: this.reply.id,
        replyto: this.reply.replyto,
        threadhead: this.reply.threadhead
      })
    },
    unlove() {
      this.$store.dispatch('newsfeed/unlove', {
        id: this.reply.id,
        replyto: this.reply.replyto,
        threadhead: this.reply.threadhead
      })
    }
  }
}
</script>
