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
              <b-dropdown-item v-if="parseInt(me.id) === parseInt(newsfeed.userid) || mod" :b-v-modal="'newsEdit' + newsfeed.id" @click="show">
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
              <b-dropdown-item v-if="canRefer" @click="referToOffer">
                Refer to OFFER
              </b-dropdown-item>
              <b-dropdown-item v-if="canRefer" @click="referToWanted">
                Refer to WANTED
              </b-dropdown-item>
              <b-dropdown-item v-if="canRefer" @click="referToTaken">
                Refer to TAKEN
              </b-dropdown-item>
              <b-dropdown-item v-if="canRefer" @click="referToReceived">
                Refer to RECEIVED
              </b-dropdown-item>
              <b-dropdown-item v-if="supportOrAdmin && newsfeed.hidden" @click="unhide">
                Unhide post
              </b-dropdown-item>
            </b-dropdown>
            <component
              :is="newsComponentName"
              :id="newsfeed.id"
              :newsfeed="newsfeed"
              :users="users"
              @focus-comment="focusComment"
            />
            <NewsPreview v-if="newsfeed.preview && !newsfeed.html" :preview="newsfeed.preview" class="mt-1" />
            <div v-if="newsfeed.hidden" class="text-danger small">
              This has been hidden and is only visible to volunteers and the person who posted it.
            </div>
          </div>
          <notice-message v-else variant="danger">
            Unknown item type {{ newsfeed.type }}
          </notice-message>
        </b-card-text>
      </b-card-body>
      <div slot="footer">
        <NewsReplies
          :id="id"
          :threadhead="newsfeed"
          :users="users"
          :scroll-to="scrollTo"
          :reply-ids="newsfeed.replies.map(r => r.id)"
          :reply-to="replyingTo"
          class="pl-3"
        />
        <span v-if="!newsfeed.closed">
          <div v-if="enterNewLine">
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
                placeholder="Write a comment on this thread..."
                class="p-0 pl-1 pt-1"
                @focus="focusedComment"
              />
            </at-ta>
          </div>
          <div
            v-else
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
                placeholder="Write a comment on this thread and hit enter to post..."
                class="p-0 pl-1 pt-1"
                autocapitalize="none"
                @keydown.enter.shift.exact.prevent="newlineComment"
                @keydown.alt.shift.exact.prevent="newlineComment"
                @focus="focusedComment"
              />
            </at-ta>
          </div>
          <div v-if="threadcomment" class="d-flex justify-content-between flex-wrap mt-2">
            <b-btn variant="secondary" @click="photoAdd">
              <v-icon name="camera" /><span class="d-none d-sm-inline">&nbsp;Add Photo</span>
            </b-btn>
            <SpinButton
              v-if="enterNewLine"
              variant="primary"
              name="angle-double-right"
              label="Post"
              spinclass="text-white"
              iconlast
              :handler="sendComment"
            />
          </div>
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
      v-if="showEditModal"
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
        <b-button variant="primary" @click="save">
          Save
        </b-button>
      </template>
    </b-modal>
    <NewsReportModal :id="newsfeed.id" ref="newsreport" />
    <ConfirmModal v-if="showDeleteModal" ref="deleteConfirm" :title="'Delete thread started by ' + starter" @confirm="deleteConfirmed" />
  </div>
</template>

<script>
import NewsReportModal from './NewsReportModal'
import SpinButton from './SpinButton'
import NewsReplies from '~/components/NewsReplies'
import twem from '~/assets/js/twem'

// Use standard import to avoid screen-flicker
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
const OurFilePond = () => import('~/components/OurFilePond')

const AtTa = process.client ? require('vue-at/dist/vue-at-textarea') : undefined

const INITIAL_NUMBER_OF_REPLIES_TO_SHOW = 10

export default {
  name: 'NewsThread',
  components: {
    NewsReplies,
    SpinButton,
    OurFilePond,
    NewsReportModal,
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
      showDeleteModal: false,
      showEditModal: false
    }
  },
  computed: {
    canRefer() {
      return (
        (this.mod && this.newsfeed.type !== 'AboutMe') || this.supportOrAdmin
      )
    },
    enterNewLine() {
      return this.$store.getters['misc/get']('enternewline')
    },
    newsfeed() {
      return this.$store.getters['newsfeed/get'](this.id)
    },
    tagusers() {
      const ret = []
      for (const user in this.users) {
        ret.push(this.users[user].displayname)
      }

      return ret.sort((a, b) => {
        if (typeof a === 'string' && typeof b === 'string') {
          return a.toLowerCase().localeCompare(b.toLowerCase())
        } else {
          return 0
        }
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
              (!this.newsfeed.replies[i].deleted &&
                this.newsfeed.replies[i].visible) ||
              this.mod
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
    starter() {
      if (
        this.newsfeed.userid === this.myid ||
        (this.newsfeed.user && this.newsfeed.user.id === this.myid)
      ) {
        return 'you'
      } else if (this.users[this.newsfeed.userid]) {
        return this.users[this.newsfeed.userid].displayname
      } else {
        return 'someone'
      }
    }
  },
  methods: {
    focusComment: function() {
      this.$refs.threadcomment.focus()
    },
    focusedComment: function() {
      this.replyingTo = this.newsfeed.id
    },
    async sendComment(e) {
      if (e) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
      }

      if (this.threadcomment && this.threadcomment.trim()) {
        // Encode up any emojis.
        const msg = twem.untwem(this.$twemoji, this.threadcomment)
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

      return false
    },
    newlineComment() {
      const p = this.$refs.threadcomment.selectionStart
      if (p) {
        this.threadcomment =
          this.threadcomment.substring(0, p) +
          '\n' +
          this.threadcomment.substring(p)
        this.$nextTick(() => {
          this.$refs.threadcomment.selectionStart = p + 1
          this.$refs.threadcomment.selectionEnd = p + 1
        })
      } else {
        this.threadcomment += '\n'
      }
    },
    show() {
      this.showEditModal = true
      this.waitForRef('editModal', () => {
        this.$refs.editModal.show()
      })
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
    async unhide() {
      await this.$store.dispatch('newsfeed/unhide', {
        id: this.id
      })
      await this.$store.dispatch('newsfeed/fetch', {
        id: this.id
      })
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
