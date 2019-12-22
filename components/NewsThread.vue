<template>
  <div v-if="newsfeed && newsfeed.visible && !newsfeed.unfollowed" class="bg-white">
    <b-card :class="backgroundColor" no-body>
      <b-card-body class="p-1 p-sm-2">
        <b-card-text>
          <div v-if="isNewsComponent">
            <b-dropdown class="float-right" right variant="white">
              <template slot="button-content" />
              <b-dropdown-item :href="'/chitchat/' + newsfeed.id" target="_blank">
                Open in new window
              </b-dropdown-item>
              <b-dropdown-item :b-v-modal="'newsEdit' + newsfeed.id" @click="show">
                Edit
              </b-dropdown-item>
              <b-dropdown-item @click="unfollow">
                Unfollow this thread
              </b-dropdown-item>
              <b-dropdown-item @click="report">
                Report this thread or one of its replies
              </b-dropdown-item>
              <b-dropdown-item v-if="parseInt(me.id) === parseInt(newsfeed.userid) || mod" @click="deleteIt">
                Delete this thread
              </b-dropdown-item>
              <b-dropdown-item v-if="mod" @click="referToOffer">
                Refer to OFFER
              </b-dropdown-item>
              <b-dropdown-item v-if="mod" @click="referToWanted">
                Refer to WANTED
              </b-dropdown-item>
              <b-dropdown-item v-if="mod" @click="referToTaken">
                Refer to TAKEN
              </b-dropdown-item>
              <b-dropdown-item v-if="mod" @click="referToReceived">
                Refer to RECEIVED
              </b-dropdown-item>
            </b-dropdown>
            <component
              :is="newsComponentName"
              :id="newsfeed.id"
              :newsfeed="newsfeed"
              :users="users"
              @focus-comment="focusComment"
            />
            <NewsPreview v-if="newsfeed.preview" :preview="newsfeed.preview" class="mt-1" />
          </div>
          <notice-message v-else variant="danger">
            Unknown item type {{ newsfeed.type }}
          </notice-message>
        </b-card-text>
      </b-card-body>
      <div slot="footer">
        <!-- TODO MINOR - Refactor out the reply logic. Also bear in mind the logic in NewsReply -->
        <b-button v-if="showEarlierRepliesOption" variant="link" class="pl-0" @click.prevent="showAllReplies = true">
          Show earlier {{ numberOfRepliesNotShown.length | pluralize(['reply', 'replies']) }} ({{ numberOfRepliesNotShown }})
        </b-button>
        <ul v-for="entry in repliestoshow" :key="'newsfeed-' + entry.id" class="list-unstyled mb-2">
          <li>
            <NewsRefer v-if="entry.type.indexOf('ReferTo') === 0" :type="entry.type" />
            <NewsReply
              v-else
              :key="'newsfeedreply-' + newsfeed.id + '-reply-' + entry.id"
              :replyid="entry.id"
              :users="users"
              :threadhead="newsfeed"
              :scroll-to="scrollTo"
            />
          </li>
        </ul>
        <span v-if="!newsfeed.closed" class="text-small">
          <b-row>
            <b-col>
              <div
                class="d-flex"
                @keyup.enter.exact.prevent
                @keydown.enter.exact="sendComment"
              >
                <at-ta ref="at" :members="tagusers" class="flex-shrink-2 input-group" :filter-match="filterMatch">
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
                    placeholder="Write a comment on this thread and hit enter..."
                    class="p-0 pl-1 pt-1"
                    @keydown.enter.shift.exact="newlineComment"
                    @keydown.alt.shift.exact="newlineComment"
                    @focus="focusedComment"
                  />
                </at-ta>
                <b-btn size="sm" variant="white" class="float-right flex-grow-1 ml-1">
                  <v-icon name="camera" /><span class="d-none d-sm-inline">&nbsp;Photo</span>
                </b-btn>
              </div>
            </b-col>
          </b-row>
        </span>
        <notice-message v-else>
          This thread is now closed.  Thanks to everyone who contributed.
        </notice-message>
      </div>
    </b-card>
    <b-modal
      :id="'newsEdit-' + newsfeed.id"
      ref="editModal"
      title="Edit your post"
      size="lg"
      no-stacking
    >
      <template slot="default">
        <b-textarea
          ref="editText"
          v-model="newsfeed.message"
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
    <NewsReportModal :id="newsfeed.id" ref="newsreport" />
  </div>
</template>

<script>
// TODO MINOR Attach to thread
// TODO DESIGN Some indication of newly added entries
import NewsReportModal from './NewsReportModal'
import twem from '~/assets/js/twem'

// Use standard import to avoid screen-flicker
import NewsReply from '~/components/NewsReply'
import NewsRefer from '~/components/NewsRefer'
import NewsMessage from '~/components/NewsMessage'
import NewsAboutMe from '~/components/NewsAboutMe'
const AtTa = process.browser
  ? require('vue-at/dist/vue-at-textarea')
  : undefined
const NewsCommunityEvent = () => import('~/components/NewsCommunityEvent')
const NewsVolunteerOpportunity = () =>
  import('~/components/NewsVolunteerOpportunity')
const NewsStory = () => import('~/components/NewsStory')
const NewsAlert = () => import('~/components/NewsAlert')
const NewsNoticeboard = () => import('~/components/NewsNoticeboard')
const NoticeMessage = () => import('~/components/NoticeMessage')
const NewsPreview = () => import('~/components/NewsPreview')

const INITIAL_NUMBER_OF_REPLIES_TO_SHOW = 10

export default {
  name: 'NewsThread',
  components: {
    NewsReportModal,
    NewsReply,
    NewsRefer,
    NewsMessage,
    NewsAboutMe,
    NewsCommunityEvent,
    NewsVolunteerOpportunity,
    NewsStory,
    NewsAlert,
    NewsNoticeboard,
    NoticeMessage,
    NewsPreview,
    AtTa
  },
  props: {
    id: {
      type: Number,
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
      replyingTo: null,
      threadcomment: null,
      showAllReplies: false,
      newsreport: false,
      newsComponents: {
        AboutMe: 'NewsAboutMe',
        Message: 'NewsMessage',
        CommunityEvent: 'NewsCommunityEvent',
        VolunteerOpportunity: 'NewsVolunteerOpportunity',
        Story: 'NewsStory',
        Alert: 'NewsAlert',
        Noticeboard: 'NewsNoticeboard'
      },
      elementBackgroundColor: {
        CommunityEvent: 'card__community-event',
        VolunteerOpportunity: 'card__volunteer-opportunity'
      }
    }
  },
  computed: {
    newsfeed() {
      return this.$store.getters['newsfeed/get'](this.id)
    },
    me() {
      return this.$store.getters['auth/user']
    },
    tagusers() {
      // TODO MINOR Would be nice to allow tagging of users who haven't contributed to the thread yet.  Same in NewsReply.
      const ret = []
      for (const user in this.users) {
        ret.push(this.users[user].displayname)
      }

      return ret
    },
    mod() {
      const me = this.me
      return (
        me &&
        (me.systemrole === 'Moderator' ||
          me.systemrole === 'Admin' ||
          me.systemrole === 'Support')
      )
    },
    backgroundColor() {
      return this.elementBackgroundColor[this.newsfeed.type] || 'card__default'
    },
    visiblereplies() {
      // These are the replies which are candidates to show, i.e. not deleted or hidden.
      const ret = []

      if (this.newsfeed) {
        if (this.newsfeed.replies && this.newsfeed.replies.length) {
          for (let i = 0; i < this.newsfeed.replies.length; i++) {
            if (
              !this.newsfeed.replies[i].deleted &&
              this.newsfeed.replies[i].visible
            ) {
              ret.push(this.newsfeed.replies[i])
            }
          }
        }
      }

      return ret
    },
    repliestoshow() {
      let ret = []

      if (this.visiblereplies && this.visiblereplies.length) {
        if (
          this.showAllReplies ||
          this.visiblereplies.length <= INITIAL_NUMBER_OF_REPLIES_TO_SHOW
        ) {
          // Return all the replies
          ret = this.visiblereplies
        } else {
          // Only return the last few replies
          ret = this.visiblereplies.slice(
            -Math.abs(INITIAL_NUMBER_OF_REPLIES_TO_SHOW)
          )
        }
      }

      return ret
    },
    isNewsComponent() {
      return this.newsfeed.type in this.newsComponents
    },
    newsComponentName() {
      return this.isNewsComponent ? this.newsComponents[this.newsfeed.type] : ''
    },
    showEarlierRepliesOption() {
      if (!this.newsfeed || !this.newsfeed.replies) {
        return false
      }

      // If we're not already showing all replies and there are still some to show after the default display
      return (
        !this.showAllReplies &&
        this.newsfeed.replies.length > INITIAL_NUMBER_OF_REPLIES_TO_SHOW
      )
    },
    numberOfRepliesNotShown() {
      if (
        !this.newsfeed ||
        !this.newsfeed.replies ||
        this.newsfeed.replies.length < INITIAL_NUMBER_OF_REPLIES_TO_SHOW
      ) {
        return 0
      }

      return this.newsfeed.replies.length - INITIAL_NUMBER_OF_REPLIES_TO_SHOW
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
      // TODO MINOR The newline gets added to the textarea before submission.  You can fix that by changing to use
      // keydown to trigger this event, but that then breaks interaction with vue-at.  Same in NewsReply.
      if (this.threadcomment) {
        // Encode up any emojis.
        const msg = twem.untwem(this.threadcomment)

        // TODO MINOR This is sluggish.  Can we fake up the reply in the store in advance, or have some other visual indicator?
        // Same applies to NewsReply.
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
      // TODO MINOR Would be good to handle inserting in the middle a block of text, though last time I looked at this it
      // was quite fiddly.
      this.threadcomment += '\n'
    },
    show() {
      this.$refs.editModal.show()
    },
    save() {
      this.$store.dispatch('newsfeed/edit', {
        id: this.newsfeed.id,
        message: this.newsfeed.message
      })

      this.$refs.editModal.hide()
    },
    deleteIt() {
      // TODO MINOR Add confirm.  We have ConfirmModal, but that needs improving a bit so you can show info about
      // what you're actually confirming.
      this.$store.dispatch('newsfeed/delete', {
        id: this.id,
        threadhead: this.id
      })
    },
    unfollow() {
      this.$store.dispatch('newsfeed/unfollow', {
        id: this.id
      })
    },
    report() {
      this.$refs.newsreport.show()
    },
    referToOffer() {
      this.referTo('Offer')
    },
    referToWanted() {
      this.referTo('Wanted')
    },
    referToTaken() {
      this.referTo('Taken')
    },
    referToReceived() {
      this.referTo('Recived')
    },
    async referTo(type) {
      await this.$store.dispatch('newsfeed/referto', {
        id: this.id,
        type: type
      })
      await this.$store.dispatch('newsfeed/fetch', {
        id: this.id
      })
    },
    filterMatch(name, chunk) {
      // Only match at start of string.
      return name.toLowerCase().indexOf(chunk.toLowerCase()) === 0
    }
  }
}
</script>

<style scoped lang="scss">
@import 'color-vars';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins/_breakpoints';

::v-deep .img-thumbnail {
  cursor: pointer;

  max-width: 100px;

  @include media-breakpoint-up(lg) {
    max-width: 100%;
  }
}

.card__community-event {
  background-color: $color-gray-1;
}

.card__volunteer-opportunity {
  background-color: $color-gray-2;
}

.card__default {
  background-color: $color-white;
}
</style>
