<template>
  <div v-if="reply.userid && users[reply.userid] && reply.visible">
    <b-row class="p-0">
      <b-col class="p-0">
        <table v-if="users[reply.userid].profile">
          <tbody>
            <tr>
              <td style="vertical-align: top">
                <b-img-lazy
                  rounded="circle"
                  class="profilemd p-0 ml-1 mb-1 mr-2 inline float-left"
                  alt="Profile picture"
                  title="Profile"
                  :src="users[reply.userid].profile.turl"
                  @error.native="brokenImage"
                />
              </td>
              <td class="align-top">
                <v-icon v-if="users[reply.userid].settings.showmod" name="leaf" class="showmodsm text-success" />
                <span class="text-success font-weight-bold">{{ users[reply.userid].displayname }}</span>
                <span class="font-weight-bold prewrap forcebreak replytext">{{ emessage }}</span>
                <span v-if="reply.message && reply.userid && users[reply.userid]">
                  <br>
                  <span class="text-muted small">
                    {{ $dayjs(reply.timestamp).fromNow() }}
                  </span>
                  <NewsUserInfo :user="users[reply.userid]" />
                  <span>
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
                      <v-icon name="heart" class="text-danger" />&nbsp;{{ reply.loves }}
                    </span>
                    <span v-if="me.id === reply.userid" v-b-modal="'newsEdit-' + reply.id">
                      &bull;&nbsp;Edit
                    </span>
                  </span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
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
      <b-col class="p-0">
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
                @error.native="brokenImage"
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
          <v-icon name="camera" />&nbsp;Photo
        </b-btn>
      </b-col>
    </b-row>
    <b-modal
      :id="'newsEdit-' + reply.id"
      ref="editModal"
      title="Edit your post"
      size="lg"
      no-stacking
    >
      <template slot="default">
        <b-textarea
          ref="editText"
          v-model="reply.message"
          rows="8"
          maxlength="2048"
          spellcheck="true"
          placeholder="Edit your post..."
        />
      </template>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button variant="white" @click="cancel">
          Cancel
        </b-button>
        <b-button variant="success" @click="save">
          Save
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<style scoped>
.replytext {
  font-size: 14px;
  line-height: 1.2;
}

.showmodsm {
  top: 28px;
  left: 26px;
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
// TODO Delete
import twem from '~/assets/js/twem'
import NewsUserInfo from '~/components/NewsUserInfo'
// import NewsBase from '~/components/NewsBase'

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
    },
    scrollTo: {
      type: String,
      required: false,
      default: ''
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
  mounted() {
    if (parseInt(this.scrollTo) === this.reply.id) {
      // We want to scroll to this reply to make sure it's visible
      this.$el.scrollIntoView()

      // TODO DESIGN Can we have some visual highlighting of the element we've just scrolled to?
    }
  },
  methods: {
    replyReply() {
      this.replyingTo = this.reply.id
      this.showReplyBox = true

      // Can't set focus immediately as not in DOM until re-render.
      this.$nextTick(() => {
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
    newlineReply() {
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
    },
    save() {
      this.$store.dispatch('newsfeed/edit', {
        id: this.reply.id,
        message: this.reply.message
      })

      this.$refs.editModal.hide()
    }
  }
}
</script>
