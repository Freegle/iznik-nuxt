<template>
  <div v-if="reply && userid && users[userid] && (reply.visible || mod)">
    <b-row class="p-0" :class="scrollToThis ? 'bg-info' : ''">
      <b-col class="p-0">
        <div v-if="users[userid].profile" class="reply">
          <div class="clickme align-top" title="Click to see their profile" @click="showInfo">
            <ProfileImage
              :image="users[userid].profile.turl"
              class="ml-1 mr-2 mt-2 mb-1 inline float-left"
              :is-moderator="(Boolean)(users[userid].settings.showmod && reply.replyto === threadhead.id)"
              :size="(reply.replyto !== threadhead.id) ? 'sm' : 'md'"
            />
          </div>
          <div class="align-top">
            <span class="text-success font-weight-bold clickme" title="Click to see their profile" @click="showInfo">{{ users[userid].displayname }}</span>
            <span :class="'font-weight-bold preline forcebreak text--small nopara ' + ((!reply.visible || reply.deleted) ? 'strike' : '')">
              <NewsHighlight
                :search-words="threadUsers"
                :text="emessage"
                :max-chars="500"
                class="font-weight-bold preline forcebreak text--small d-inline"
              /> <br>
            </span>
            <div v-if="reply.image">
              <b-img
                v-b-modal="'photoModal-' + replyid"
                rounded
                class="clickme replyphoto"
                generator-unable-to-provide-required-alt=""
                :src="reply.image.paththumb"
                @error="brokenImage"
              />
            </div>
            <span v-if="userid && users[userid]" class="text-muted d-flex flex-row flex-wrap align-items-center">
              <span class="text-muted small mr-1">
                {{ timeago(reply.added) }}
              </span>
              <NewsUserInfo :user="users[userid]" class="px-1" />
              <b-btn variant="link" size="sm" class="reply__button text-muted" @click="replyReply">
                Reply
              </b-btn>
              <b-btn v-if="!reply.loved" variant="link" size="sm" class="reply__button text-muted" @click="love">
                Love this
              </b-btn>
              <b-btn v-if="reply.loved" variant="link" size="sm" class="reply__button text-muted" @click="unlove">
                Unlove this
              </b-btn>
              <b-btn
                v-if="reply.loves"
                variant="link"
                size="sm"
                class="mr-1 small text-muted showlove"
                :aria-label="getShowLovesLabel"
                @click="showLove"
              >
                <v-icon name="heart" class="text-danger" />&nbsp;{{ reply.loves }}
              </b-btn>
              <b-btn v-if="parseInt(me.id) === parseInt(userid)" variant="link" size="sm" class="reply__button text-muted " @click="showEdit">
                Edit
              </b-btn>
              <b-btn v-if="parseInt(me.id) === parseInt(userid) || mod" variant="link" size="sm" class="reply__button text-muted" @click="deleteReply">
                Delete
              </b-btn>
              <ChatButton
                v-if="parseInt(me.id) !== parseInt(userid)"
                class="reply__button text-muted d-flex align-items-center"
                :userid="userid"
                title="Message"
                variant="link"
                size="sm"
                :show-icon="false"
                btn-class="text-muted"
              />
            </span>
            <NewsPreview v-if="reply.preview" :preview="reply.preview" class="mt-1" size="sm" />
            <div v-if="reply.hidden" class="text-danger small">
              This has been hidden and is only visible to volunteers and the person who posted it.
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
    <NewsReplies
      :id="id"
      :threadhead="threadhead"
      :users="users"
      :scroll-to="scrollTo"
      :reply-ids="reply.replies.map(r => r.id)"
      :reply-to="reply.id"
      :class="firstlevel ? 'pl-3' : ''"
    />
    <div v-if="showReplyBox" class="mb-2 pb-1 ml-4">
      <div v-if="enterNewLine" class="w-100">
        <at-ta ref="at" :members="tagusers" class="pl-2 input-group" :filter-match="filterMatch">
          <b-input-group-prepend>
            <span class="input-group-text pl-1 pr-1">
              <ProfileImage v-if="me.profile.turl" :image="me.profile.turl" class="m-0 inline float-left" is-thumbnail size="sm" />
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
            placeholder="Write a reply to this comment..."
            class="p-0 pl-1 pt-1"
            @focus="focusedReply"
          />
        </at-ta>
      </div>
      <div
        v-else
        class="w-100"
        @keyup.enter.exact.prevent
        @keydown.enter.exact="sendReply"
      >
        <at-ta ref="at" :members="tagusers" class="pl-2 input-group" :filter-match="filterMatch">
          <b-input-group-prepend>
            <span class="input-group-text pl-1 pr-1">
              <ProfileImage v-if="me.profile.turl" :image="me.profile.turl" class="m-0 inline float-left" is-thumbnail size="sm" />
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
            placeholder="Write a reply to this comment and hit enter to send..."
            class="p-0 pl-1 pt-1"
            autocapitalize="none"
            @keydown.enter.exact.prevent
            @keyup.enter.exact="sendReply"
            @keydown.enter.shift.exact.prevent="newlineReply"
            @keydown.alt.shift.exact.prevent="newlineReply"
            @focus="focusedReply"
          />
        </at-ta>
      </div>
      <div class="d-flex justify-content-between flex-wrap mt-1 pl-2">
        <b-btn size="sm" variant="secondary" @click="photoAdd">
          <v-icon name="camera" />&nbsp;Add Photo
        </b-btn>
        <SpinButton
          v-if="enterNewLine"
          variant="primary"
          name="angle-double-right"
          label="Post"
          iconlast
          spinclass="text-white"
          :handler="sendReply"
        />
      </div>
    </div>
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
      v-if="showEditModal"
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
        <b-button variant="primary" @click="save">
          Save
        </b-button>
      </template>
    </b-modal>
    <ProfileModal v-if="infoclick" :id="userid" ref="profilemodal" />
    <NewsLovesModal v-if="showLoveModal" :id="replyid" ref="loveModal" />
    <ConfirmModal v-if="showDeleteModal" ref="deleteConfirm" :title="'Delete reply from ' + users[userid].displayname" @confirm="deleteConfirm" />
  </div>
</template>

<script>
import NewsLovesModal from './NewsLovesModal'
import SpinButton from './SpinButton'
import twem from '~/assets/js/twem'

import NewsUserInfo from '~/components/NewsUserInfo'
import NewsHighlight from '~/components/NewsHighlight'
import ChatButton from '~/components/ChatButton'
import NewsPreview from '~/components/NewsPreview'
import ProfileImage from '~/components/ProfileImage'

const ProfileModal = () => import('~/components/ProfileModal')
const ConfirmModal = () => import('~/components/ConfirmModal.vue')
const NewsReplies = () => import('~/components/NewsReplies.vue')
const OurFilePond = () => import('~/components/OurFilePond')

const AtTa = process.client ? require('vue-at/dist/vue-at-textarea') : undefined

export default {
  name: 'NewsReply',
  components: {
    NewsReplies,
    SpinButton,
    OurFilePond,
    NewsLovesModal,
    NewsUserInfo,
    NewsHighlight,
    ProfileModal,
    ChatButton,
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
      imagethumb: null,
      showDeleteModal: false,
      showLoveModal: false,
      showEditModal: false
    }
  },
  computed: {
    enterNewLine() {
      return this.$store.getters['misc/get']('enternewline')
    },
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
    scrollToThis() {
      return parseInt(this.scrollTo) === this.replyid
    },
    getShowLovesLabel() {
      return (
        'This comment has ' +
        this.$options.filters.pluralize(this.reply.loves, ['love', 'loves'], {
          includeNumber: true
        }) +
        '. Who loves this?'
      )
    }
  },
  mounted() {
    if (parseInt(this.scrollTo) === this.replyid && this.$el.scrollIntoView) {
      // We want to scroll to this reply to make sure it's visible.
      this.$nextTick(() => {
        this.$el.scrollIntoView(false)
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
    async sendReply(e) {
      if (e) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
      }

      // Encode up any emojis.
      if (this.replybox && this.replybox.trim()) {
        const msg = twem.untwem(this.$twemoji, this.replybox)

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

        // Force re-render.  Store reactivity doesn't seem to work nicely with the nested reply structure we have.
        this.bump++
      }
    },
    newlineReply() {
      const p = this.$refs.replybox.selectionStart
      if (p) {
        this.replybox =
          this.replybox.substring(0, p) + '\n' + this.replybox.substring(p)
        this.$nextTick(() => {
          this.$refs.replybox.selectionStart = p + 1
          this.$refs.replybox.selectionEnd = p + 1
        })
      } else {
        this.replybox += '\n'
      }
    },
    async love(e) {
      const el = e.target
      el.classList.add('pulsate')
      await this.$store.dispatch('newsfeed/love', {
        id: this.replyid,
        replyto: this.reply.replyto,
        threadhead: this.reply.threadhead
      })
      el.classList.remove('pulsate')
    },
    async unlove(e) {
      const el = e.target
      el.classList.add('pulsate')
      await this.$store.dispatch('newsfeed/unlove', {
        id: this.replyid,
        replyto: this.reply.replyto,
        threadhead: this.reply.threadhead
      })
      el.classList.remove('pulsate')
    },
    save() {
      this.$store.dispatch('newsfeed/edit', {
        id: this.replyid,
        message: this.reply.message,
        threadhead: this.reply.threadhead
      })

      this.$refs.editModal.hide()
    },
    deleteReply() {
      this.showDeleteModal = true
      this.waitForRef('deleteConfirm', () => {
        this.$refs.deleteConfirm.show()
      })
    },
    deleteConfirm() {
      this.$store.dispatch('newsfeed/delete', {
        id: this.replyid,
        threadhead: this.threadhead.id
      })
    },
    brokenImage(event) {
      event.target.src = require('~/static/defaultprofile.png')
    },
    showEdit() {
      this.showEditModal = true
      this.waitForRef('editModal', () => {
        this.$refs.editModal.show()
      })
    },
    showLove() {
      this.showLoveModal = true
      this.waitForRef('loveModal', () => {
        this.$refs.loveModal.show()
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

.reply {
  display: flex;
}

.replyphoto {
  width: 150px;
}

.image__uploaded {
  width: 100px;
}

.reply__button {
  margin-left: 3px;
  margin-right: 3px;
  padding: 0;

  &:before {
    content: '\2022';
    padding-right: 2px;
  }
}

.showlove {
  border: none;
  padding: 3px;
  font-size: 0.8rem;
}

::v-deep .fa-icon {
  margin-bottom: 1px;
}

::v-deep .strike {
  text-decoration: line-through;
}
</style>
