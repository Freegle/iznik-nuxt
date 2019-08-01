<template>
  <div v-if="newsfeed && newsfeed.visible && !newsfeed.unfollowed" class="bg-white">
    <b-card>
      <b-card-text>
        <news-message v-if="newsfeed.type === 'Message'" :id="newsfeed.id" :newsfeed="newsfeed" :users="users" @focus-comment="focusComment" />
        <news-about-me v-else-if="newsfeed.type === 'AboutMe'" :id="newsfeed.id" :newsfeed="newsfeed" :users="users" @focus-comment="focusComment" />
        <news-community-event v-else-if="newsfeed.type === 'CommunityEvent'" :id="newsfeed.id" :newsfeed="newsfeed" :users="users" @focus-comment="focusComment" />
        <news-volunteer-opportunity v-else-if="newsfeed.type === 'VolunteerOpportunity'" :id="newsfeed.id" :newsfeed="newsfeed" :users="users" @focus-comment="focusComment" />
        <news-story v-else-if="newsfeed.type === 'Story'" :id="newsfeed.id" :newsfeed="newsfeed" :users="users" @focus-comment="focusComment" />
        <b-alert v-else variant="danger" show>
          Unknown item type {{ newsfeed.type }}
        </b-alert>
      </b-card-text>
      <div slot="footer">
        <div v-if="newsfeed.replies && newsfeed.replies.length > 0">
          <ul v-for="(entry, $index) in newsfeed.replies" :key="'newsfeed-' + $index" class="p-0 pt-1 list-unstyled mb-1">
            <li>
              <news-reply :key="'newsfeedreply-' + newsfeed.id + '-reply-' + entry.id" :reply="entry" :users="users" :threadhead="newsfeed" />
            </li>
          </ul>
        </div>
        <span v-if="!newsfeed.closed" class="text-small">
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
              <b-btn size="sm" variant="white" class="float-right">
                <fa icon="camera" />&nbsp;Photo
              </b-btn>
            </b-col>
          </b-row>
        </span>
        <b-alert v-else variant="info" show>
          This thread is now closed.  Thanks to everyone who contributed.
        </b-alert>
      </div>
    </b-card>
  </div>

  <!-- TODO 'CentralPublicity':-->
  <!-- TODO 'Alert':-->
  <!-- TODO 'Story':-->
  <!-- TODO 'Noticeboard':-->
</template>
<style scoped>
.profilesm {
  width: 25px !important;
  height: 25px !important;
}

.volunteerDescription {
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
}
</style>
<script>
// TODO Show earlier for replies; currently limited to 10
// TODO Click to show profile
// TODO Love this function
// TODO Post photos
// TODO Report etc menu dropdown
// TODO Delete
// TODO Edit
// TODO Some indication of newly added entries
// TODO Share
// TODO Click on loves to show who loves them
import NewsReply from '~/components/NewsReply'
import NewsMessage from '~/components/NewsMessage'
import NewsAboutMe from '~/components/NewsAboutMe'
import NewsCommunityEvent from '~/components/NewsCommunityEvent'
import NewsVolunteerOpportunity from '~/components/NewsVolunteerOpportunity'
import NewsStory from '~/components/NewsStory'

export default {
  components: {
    NewsReply,
    NewsMessage,
    NewsAboutMe,
    NewsCommunityEvent,
    NewsVolunteerOpportunity,
    NewsStory
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
    newsfeed() {
      return this.$store.getters['newsfeed/get'](this.id)
    },
    me() {
      return this.$store.state.auth.user
    }
  },
  methods: {
    focusComment: function() {
      this.$refs.threadcomment.focus()
    },
    focusedComment: function() {
      this.replyingTo = this.newsfeed.id
    }
  }
}
</script>
