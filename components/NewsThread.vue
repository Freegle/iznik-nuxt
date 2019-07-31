<template>
  <div v-if="newsfeed" class="bg-white">
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
              <fa v-if="users[newsfeed.userid].settings.showmod" icon="leaf" class="showmod text-success" />
              <span class="text-success font-weight-bold pl-2">
                {{ users[newsfeed.userid].displayname }}
              </span>
              <br>
              <span class="text-muted small pl-2">
                {{ $moment(newsfeed.timestamp).fromNow() }}
              </span>
              <NewsUserInfo :user="users[newsfeed.userid]" />
            </div>
          </b-col>
        </b-row>
        <b-row v-if="newsfeed.message">
          <b-col>
            <span class="font-weight-bold prewrap">{{ emessage }}</span>
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col>
            <ul class="list-unstyled list-inline">
              <li class="list-inline-item">
                <b-btn v-if="!newsfeed.loved" variant="white" size="sm" @click="love">
                  <fa icon="heart" />&nbsp;Love this
                </b-btn>
                <b-btn v-if="newsfeed.loved" variant="white" size="sm" @click="unlove">
                  <fa class="text-danger" icon="heart" />&nbsp;Unlove this
                </b-btn>
              </li>
              <li class="list-inline-item">
                <b-btn variant="white" size="sm" @click="focusComment">
                  <fa icon="comment" />&nbsp;Comment
                </b-btn>
              </li>
              <li class="list-inline-item">
                <span v-if="newsfeed.loves">
                  <fa icon="heart" class="text-danger" />&nbsp;{{ newsfeed.loves }}
                </span>
              </li>
            </ul>
          </b-col>
        </b-row>
      </b-card-text>
      <div slot="footer">
        <div v-if="newsfeed.replies && newsfeed.replies.length > 0">
          <ul v-for="(entry, $index) in newsfeed.replies" :key="'newsfeed-' + $index" class="p-0 pt-1 list-unstyled mb-1">
            <li>
              <news-reply :key="'newsfeedreply-' + newsfeed.id + '-reply-' + entry.id" :reply="entry" :users="users" />
            </li>
          </ul>
        </div>
        <span class="text-small">
          <b-row>
            <b-col>
              <b-input-group>
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
                  ref="threadcomment"
                  v-model="threadcomment"
                  size="sm"
                  rows="1"
                  max-rows="8"
                  maxlength="2048"
                  spellcheck="true"
                  placeholder="Write a comment..."
                  class="p-0 pl-1 pt-1"
                  @keydown.enter.exact.prevent
                  @keyup.enter.exact="sendComment"
                  @keydown.enter.shift.exact="newlineComment"
                  @keydown.alt.shift.exact="newlineComment"
                  @focus="focusedComment"
                />
              </b-input-group>
            </b-col>
            <b-col cols="1" class="p-0">
              <b-btn size="sm" variant="primary" class="float-right">
                <fa icon="camera" />&nbsp;Photo
              </b-btn>
            </b-col>
          </b-row>
        </span>
      </div>
    </b-card>
  </div>
</template>
<style scoped>
.profile {
  width: 50px !important;
  height: 50px !important;
}

.profilesm {
  width: 25px !important;
  height: 25px !important;
}

.showmod {
  top: 29px;
  left: 44px;
  border-radius: 50%;
  position: absolute;
  background-color: white;
  width: 24px;
  height: 24px;
  padding-left: 5px;
  padding-top: 4px;
  border: 1px solid green;
}
</style>
<script>
// TODO Show earlier for replies; currently limited to 10
// TODO Click to show profile
// TODO Love this function
// TODO Post photos
// TODO Report etc menu dropdown
// TODO Alt+Enter
// TODO Delete
// TODO Edit
// TODO Some indication of newly added entries
import twem from '~/assets/js/twem'
import NewsUserInfo from '~/components/NewsUserInfo'
import NewsReply from '~/components/NewsReply'

export default {
  components: {
    NewsUserInfo,
    NewsReply
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    users: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      replyingTo: null,
      threadcomment: null
    }
  },
  computed: {
    emessage() {
      return this.newsfeed.message
        ? twem.twem(this.$twemoji, this.newsfeed.message)
        : null
    },
    me() {
      return this.$store.state.auth.user
    },
    newsfeed() {
      return this.$store.getters['newsfeed/get'](this.id)
    }
  },
  methods: {
    focusComment: function() {
      this.$refs.threadcomment.focus()
    },
    focusedComment: function() {
      this.replyingTo = this.newsfeed.id
    },
    async sendComment() {
      // Encode up any emojis.
      if (this.threadcomment) {
        const msg = twem.untwem(this.threadcomment)

        await this.$store.dispatch('newsfeed/send', {
          message: msg,
          replyto: this.replyingTo,
          threadhead: this.newsfeed.threadhead
        })

        // New message will be shown because it's in the store and we have a computed property.

        // Clear the textarea now it's sent.
        this.threadcomment = null
      }
    },
    newlineComment() {
      this.threadcomment += '\n'
    },
    love() {
      this.$store.dispatch('newsfeed/love', {
        id: this.newsfeed.id,
        replyto: this.replyingTo,
        threadhead: this.newsfeed.threadhead
      })
    },
    unlove() {
      this.$store.dispatch('newsfeed/unlove', {
        id: this.newsfeed.id,
        replyto: this.replyingTo,
        threadhead: this.newsfeed.threadhead
      })
    }
  }
}
</script>
