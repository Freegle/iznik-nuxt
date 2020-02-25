<template>
  <div v-if="newsfeed && newsfeed.visible && !newsfeed.unfollowed" class="bg-white">
    <b-card :class="backgroundColor" no-body>
      <b-card-body class="p-1 p-sm-2">
        <b-card-text>
          <div v-if="isNewsComponent">
            <b-dropdown class="float-right" right variant="white">
              <template slot="button-content" />
              <b-dropdown-item v-if="!isApp" :href="'/chitchat/' + newsfeed.id" target="_blank">
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
        <span v-if="!newsfeed.closed">
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
                      <ProfileImage v-if="me.profile.turl" :image="me.profile.turl" class="m-0 inline float-left" is-thumbnail size="sm" />
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
                    @keydown.enter.shift.exact.prevent="newlineComment"
                    @keydown.alt.shift.exact.prevent="newlineComment"
                    @focus="focusedComment"
                  />
                </at-ta>
                <b-btn size="sm" variant="white" class="float-right flex-grow-1 ml-1" @click="photoAdd">
                  <v-icon name="camera" /><span class="d-none d-sm-inline">&nbsp;Photo</span>
                </b-btn>
              </div>
            </b-col>
          </b-row>
          <b-img v-if="imageid" lazy thumbnail :src="imagethumb" class="mt-1 ml-4 image__uploaded" />
          <OurFilePond
            v-if="uploading"
            class="bg-white m-0 pondrow"
            imgtype="Newsfeed"
            imgflag="newsfeed"
            @photoProcessed="photoProcessed"
          />
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
    <ConfirmModal v-if="showDeleteModal" ref="deleteConfirm" :title="'Delete thread started by ' + users[newsfeed.userid].displayname" @confirm="deleteConfirmed" />
  </div>
</template>

<script>
import waitForRef from '../mixins/waitForRef'
import NewsReportModal from './NewsReportModal'
import OurFilePond from './OurFilePond'
import twem from '~/assets/js/twem'

// Use standard import to avoid screen-flicker
import NewsReply from '~/components/NewsReply'
import NewsRefer from '~/components/NewsRefer'
import NewsMessage from '~/components/NewsMessage'
import NewsAboutMe from '~/components/NewsAboutMe'
import NewsCommunityEvent from '~/components/NewsCommunityEvent'
import NewsVolunteerOpportunity from '~/components/NewsVolunteerOpportunity'
import NewsStory from '~/components/NewsStory'
import NewsAlert from '~/components/NewsAlert'
import NewsNoticeboard from '~/components/NewsNoticeboard'
import NoticeMessage from '~/components/NoticeMessage'
import NewsPreview from '~/components/NewsPreview'
import ProfileImage from '~/components/ProfileImage'

const ConfirmModal = () => import('~/components/ConfirmModal.vue')

const AtTa = process.browser
  ? require('vue-at/dist/vue-at-textarea')
  : undefined

const INITIAL_NUMBER_OF_REPLIES_TO_SHOW = 10

export default {
  name: 'NewsThread',
  components: {
    OurFilePond,
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
    AtTa,
    ProfileImage,
    ConfirmModal
  },
  mixins: [waitForRef],
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
      },
      uploading: false,
      imageid: null,
      imagethumb: null,
      showDeleteModal: false
    }
  },
  computed: {
    newsfeed() {
      return this.$store.getters['newsfeed/get'](this.id)
    },
    tagusers() {
      const ret = []
      for (const user in this.users) {
        ret.push(this.users[user].displayname)
      }

      return ret.sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase())
      })
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
    },
    isApp() {
      return process.env.IS_APP
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
      if (this.threadcomment && this.threadcomment.trim()) {
        // Encode up any emojis.
        const msg = twem.untwem(this.threadcomment)
        await this.$store.dispatch('newsfeed/send', {
          message: msg,
          replyto: this.replyingTo,
          threadhead: this.newsfeed.threadhead,
          imageid: this.imageid
        })

        // New message will be shown because it's in the store and we have a computed property.

        // Clear the textarea now it's sent.
        this.threadcomment = null

        // And any image id
        this.imageid = null
      }
    },
    newlineComment() {
      const p = this.$refs.threadcomment.selectionStart
      if (p) {
        this.threadcomment =
          this.threadcomment.substring(0, p) +
          '\n' +
          this.threadcomment.substring(p)
      } else {
        this.threadcomment += '\n'
      }
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
      this.showDeleteModal = true
      this.waitForRef('deleteConfirm', () => {
        this.$refs.deleteConfirm.show()
      })
    },
    deleteConfirmed() {
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
    },
    photoAdd() {
      // Flag that we're uploading.  This will trigger the render of the filepond instance and subsequently the
      // init callback below.
      this.uploading = true
    },
    photoProcessed(imageid, imagethumb) {
      // We have uploaded a photo.  Remove the filepond instance.
      this.uploading = false

      // The imageid is in this.imageid
      this.imageid = imageid
      this.imagethumb = imagethumb
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

.image__uploaded {
  width: 100px;
}
</style>
