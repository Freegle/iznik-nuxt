<template>
  <div v-if="reply && userid && users[userid] && reply.visible">
    <b-row class="p-0">
      <b-col class="p-0">
        <table v-if="users[userid].profile">
          <tbody>
            <tr>
              <td class="clickme align-top" title="Click to see their profile" @click="showInfo">
                <profile-image
                  :image="users[userid].profile.turl"
                  class="ml-1 mr-2 mt-2 mb-1 inline float-left"
                  :is-moderator="users[userid].settings.showmod && reply.replyto === threadhead.id"
                  :size="(reply.replyto !== threadhead.id) ? 'sm' : 'md'"
                />
              </td>
              <td class="align-top">
                <span class="text-success font-weight-bold clickme" title="Click to see their profile" @click="showInfo">{{ users[userid].displayname }}</span>
                <span class="font-weight-bold prewrap forcebreak replytext nopara">
                  <NewsHighlight
                    :search-words="threadUsers"
                    :text="emessage"
                    :max-chars="500"
                    class="font-weight-bold prewrap forcebreak replytext d-inline"
                  /> <br>
                </span>
                <div v-if="reply.image">
                  <b-img
                    v-b-modal="'photoModal-' + replyid"
                    rounded
                    class="clickme replyphoto"
                    generator-unable-to-provide-required-alt=""
                    :src="reply.image.paththumb"
                    @error.native="brokenImage"
                  />
                </div>
                <span v-if="userid && users[userid]">
                  <span class="text-muted small">
                    {{ reply.timestamp | timeago }}
                  </span>
                  <NewsUserInfo :user="users[userid]" />
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
                    <span v-if="reply.loves" class="clickme" @click="showLove">
                      <v-icon name="heart" class="text-danger" />&nbsp;{{ reply.loves }}
                    </span>
                    <span v-if="parseInt(me.id) === parseInt(userid)" v-b-modal="'newsEdit-' + replyid">
                      &bull;&nbsp;Edit
                    </span>
                    <span v-if="parseInt(me.id) === parseInt(userid) || mod" @click="deleteReply">
                      &bull;&nbsp;Delete
                    </span>
                    <span v-if="parseInt(me.id) !== parseInt(userid)">
                      &bull;&nbsp;
                      <ChatButton
                        :userid="userid"
                        size="naked"
                        title="Message"
                      />
                    </span>
                  </span>
                </span>
                <NewsPreview v-if="reply.preview" :preview="reply.preview" class="mt-1" size="sm" />
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
    <b-button v-if="showEarlierRepliesOption" variant="link" class="pl-0" @click.prevent="showAllReplies = true">
      Show earlier {{ numberOfRepliesNotShown | pluralize(['reply', 'replies']) }} ({{ numberOfRepliesNotShown }})
    </b-button>
    <div v-if="repliestoshow && repliestoshow.length > 0" :class="firstlevel ? 'pl-3' : ''">
      <ul v-for="entry in repliestoshow" :key="'newsfeed-' + entry.id" class="'p-0 pt-1 list-unstyled mb-1 pl-1 border-left">
        <li>
          <news-refer v-if="entry.type.indexOf('ReferTo') === 0" :type="entry.type" />
          <news-reply v-else :key="'newsfeedreply-' + replyid + '-reply-' + entry.id" :replyid="entry.id" :users="users" :threadhead="threadhead" />
        </li>
      </ul>
    </div>
    <b-row v-if="showReplyBox" class="mb-2">
      <b-col class="p-0 pb-1 d-flex ml-4">
        <div
          class="d-flex w-100"
          @keyup.enter.exact.prevent
          @keydown.enter.exact="sendReply"
        >
          <at-ta ref="at" :members="tagusers" class="pl-4 flex-shrink-2 input-group" :filter-match="filterMatch">
            <b-input-group-prepend>
              <span class="input-group-text pl-1 pr-1">
                <profile-image v-if="me.profile.turl" :image="me.profile.turl" class="m-0 inline float-left" is-thumbnail size="sm" />
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
              placeholder="Write a reply to this comment and hit enter..."
              class="p-0 pl-1 pt-1"
              @keydown.enter.exact.prevent
              @keyup.enter.exact="sendReply"
              @keydown.enter.shift.exact.prevent="newlineReply"
              @keydown.alt.shift.exact.prevent="newlineReply"
              @focus="focusedReply"
            />
          </at-ta>
          <b-btn size="sm" variant="white" class="flex-grow-1 float-right ml-1" @click="photoAdd">
            <v-icon name="camera" />&nbsp;Photo
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
    <b-modal
      v-if="reply.image"
      :id="'photoModal-' + replyid"
      ref="photoModal"
      title="ChitChat Photo"
      generator-unable-to-provide-required-alt=""
      size="lg"
      no-stacking
      ok-only
    >
      <template slot="default">
        <b-img
          fluid
          rounded
          center
          :src="reply.image.path"
        />
      </template>
    </b-modal>
    <b-modal
      :id="'newsEdit-' + replyid"
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
    <ProfileModal v-if="infoclick" :id="userid" ref="profilemodal" />
    <NewsLovesModal :id="replyid" ref="loveModal" />
  </div>
</template>

<script>
import NewsLovesModal from './NewsLovesModal'
import OurFilePond from './OurFilePond'
import twem from '~/assets/js/twem'

import NewsUserInfo from '~/components/NewsUserInfo'
import NewsHighlight from '~/components/NewsHighlight'
import ChatButton from '~/components/ChatButton'
import NewsPreview from '~/components/NewsPreview'
import NewsRefer from '~/components/NewsRefer'
import ProfileImage from '~/components/ProfileImage'
const ProfileModal = () => import('~/components/ProfileModal')

const AtTa = process.browser
  ? require('vue-at/dist/vue-at-textarea')
  : undefined

const INITIAL_NUMBER_OF_REPLIES_TO_SHOW = 5

export default {
  name: 'NewsReply',
  components: {
    OurFilePond,
    NewsLovesModal,
    NewsUserInfo,
    NewsHighlight,
    ProfileModal,
    ChatButton,
    NewsPreview,
    NewsRefer,
    AtTa,
    ProfileImage
  },
  props: {
    threadhead: {
      type: Object,
      required: true
    },
    replyid: {
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
      showReplyBox: false,
      replyingTo: null,
      replybox: null,
      infoclick: false,
      showAllReplies: false,
      uploading: false,
      imageid: null,
      imagethumb: null
    }
  },
  computed: {
    userid() {
      // The API can return slightly different things in different places.
      if (this.reply.userid) {
        return this.reply.userid
      }

      if (this.reply.user) {
        return this.reply.user.id
      }

      return null
    },
    reply() {
      const ret = this.$store.getters['newsfeed/get'](this.replyid)
      return ret
    },
    firstlevel() {
      // We need to know which are the first level replies, because we indent those but not any subsequent replies.
      return this.reply && this.reply.replyto === this.reply.threadhead
    },
    me() {
      return this.$store.getters['auth/user']
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
    emessage() {
      return this.reply.message
        ? (twem.twem(this.$twemoji, this.reply.message) + '').trim()
        : null
    },
    threadUsers() {
      const ret = []
      for (const user in this.users) {
        ret.push('@' + this.users[user].displayname)
      }
      return ret
    },
    visiblereplies() {
      // These are the replies which are candidates to show, i.e. not deleted or hidden.
      const ret = []

      if (this.reply) {
        if (this.reply.replies && this.reply.replies.length) {
          for (let i = 0; i < this.reply.replies.length; i++) {
            if (
              !this.reply.replies[i].deleted &&
              this.reply.replies[i].visible
            ) {
              ret.push(this.reply.replies[i])
            }
          }
        }
      }

      return ret
    },
    repliestoshow() {
      let ret = []

      if (this.visiblereplies.length) {
        if (
          this.showAllReplies ||
          this.visiblereplies.length <= INITIAL_NUMBER_OF_REPLIES_TO_SHOW
        ) {
          // Return all the replies
          ret = this.visiblereplies
        } else {
          // We have to prune what we show, but we should show any replyto.
          ret = this.visiblereplies
          let pruned = 0
          let pruneAt = ret - 1

          while (
            pruned < INITIAL_NUMBER_OF_REPLIES_TO_SHOW &&
            pruneAt < ret.length
          ) {
            if (ret[pruneAt].id !== parseInt(this.replyTo)) {
              pruned++
              ret.splice(pruneAt, 1)
            } else {
              pruneAt++
            }
          }
        }
      }

      return ret
    },
    showEarlierRepliesOption() {
      if (!this.reply || !this.reply.replies) {
        return false
      }

      // If we're not already showing all replies and there are still some to show after the default display
      return (
        !this.showAllReplies &&
        this.visiblereplies.length > INITIAL_NUMBER_OF_REPLIES_TO_SHOW
      )
    },
    numberOfRepliesNotShown() {
      if (
        !this.visiblereplies ||
        this.visiblereplies.length < INITIAL_NUMBER_OF_REPLIES_TO_SHOW
      ) {
        return 0
      }

      return this.visiblereplies.length - INITIAL_NUMBER_OF_REPLIES_TO_SHOW
    }
  },
  mounted() {
    if (parseInt(this.scrollTo) === this.replyid && this.$el.scrollIntoView) {
      // We want to scroll to this reply to make sure it's visible.
      this.$nextTick(() => {
        this.$el.scrollIntoView()
      })
    }
  },
  methods: {
    showInfo() {
      // We use v-if so that the profile modal is not inserted into the DOM until we have clicked, which saves the
      // fetch of the user info.
      this.infoclick = true
      setTimeout(() => {
        this.$refs.profilemodal.show()
      }, 25)
    },
    replyReply() {
      console.log('Replying to', this.replyid, this.reply)
      this.replyingTo = this.replyid
      this.showReplyBox = true

      // Can't set focus immediately as not in DOM until re-render.
      this.$nextTick(() => {
        this.$refs.replybox.focus()

        // Reply with tag.
        this.replybox = '@' + this.users[this.userid].displayname + ' '
      })
    },
    focusReply: function() {
      this.$refs.replybox.focus()
    },
    focusedReply: function() {
      this.replyingTo = this.replyid
    },
    async sendReply() {
      // Encode up any emojis.
      if (this.replybox) {
        const msg = twem.untwem(this.replybox)

        await this.$store.dispatch('newsfeed/send', {
          message: msg,
          replyto: this.replyingTo,
          threadhead: this.reply.threadhead,
          imageid: this.imageid
        })

        // New message will be shown because it's in the store and we have a computed property.

        // Clear and hide the textarea now it's sent.
        this.replybox = null
        this.showReplyBox = false

        // And any image id
        this.imageid = null
      }
    },
    newlineReply() {
      const p = this.$refs.replybox.selectionStart
      if (p) {
        this.replybox =
          this.replybox.substring(0, p) + '\n' + this.replybox.substring(p)
      } else {
        this.replybox += '\n'
      }
    },
    love(e) {
      const el = e.target
      el.classList.add('pulsate')
      this.$store.dispatch('newsfeed/love', {
        id: this.replyid,
        replyto: this.reply.replyto,
        threadhead: this.reply.threadhead
      })
      el.classList.remove('pulsate')
    },
    unlove(e) {
      const el = e.target
      el.classList.add('pulsate')
      this.$store.dispatch('newsfeed/unlove', {
        id: this.replyid,
        replyto: this.reply.replyto,
        threadhead: this.reply.threadhead
      })
      el.classList.remove('pulsate')
    },
    save() {
      this.$store.dispatch('newsfeed/edit', {
        id: this.replyid,
        message: this.reply.message
      })

      this.$refs.editModal.hide()
    },
    deleteReply() {
      this.$store.dispatch('newsfeed/delete', {
        id: this.replyid,
        threadhead: this.threadhead.id
      })
    },
    brokenImage(event) {
      event.target.src = '/static/defaultprofile.png'
    },
    showLove() {
      this.$refs.loveModal.show()
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

.replytext {
  font-size: 14px;
  line-height: 1.2;
}

.replyphoto {
  width: 150px;
}

.image__uploaded {
  width: 100px;
}
</style>
