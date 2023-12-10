<template>
  <b-modal
    id="sharemodal"
    v-model="showModal"
    title="Share a post"
    size="lg"
  >
    <template slot="default">
      <div v-if="message">
        <h3>
          {{ message.subject }}
        </h3>
        <NoticeMessage variant="info">
          <p>
            Please share - you might get a response from people you know, or a group you're in.
          </p>
          <p>
            And lots of people haven't heard of Freegle - so it helps get them freegling too!
          </p>
        </NoticeMessage>
        <div class="d-flex flex-wrap justify-content-around mt-3">
          <b-button v-if="isApp" variant="primary" size="lg" class="m-3" @click="shareApp">
            Share now
          </b-button>
          <div v-if="!isApp">
          <social-sharing
            :url="message.url"
            :title="'Sharing ' + message.subject"
            :description="message.textbody"
            hashtags="freegle,free,reuse"
            inline-template
            @open="chose"
          >
            <network network="facebook">
              <b-btn variant="secondary" size="lg" class="facebook mt-1 mb-1">
                <v-icon name="brands/facebook" /> Facebook
              </b-btn>
            </network>
          </social-sharing>
          <social-sharing
            :url="message.url"
            :title="'Sharing ' + message.subject"
            :description="message.textbody"
            hashtags="freegle,free,reuse"
            inline-template
            @open="chose"
          >
            <network network="twitter">
              <b-btn variant="secondary" size="lg" class="twitter mt-1 mb-1">
                <v-icon name="brands/twitter" /> Twitter
              </b-btn>
            </network>
          </social-sharing>
          <social-sharing
            :url="message.url"
            :title="'Sharing ' + message.subject"
            :description="message.textbody"
            hashtags="freegle,free,reuse"
            inline-template
            @open="chose"
          >
            <network network="email">
              <b-btn variant="primary" size="lg" class="gmail mt-1 mb-1">
                <v-icon name="envelope" /> Email
              </b-btn>
            </network>
          </social-sharing>
          <social-sharing
            :url="message.url"
            :title="'Sharing ' + message.subject"
            :description="message.textbody"
            hashtags="freegle,free,reuse"
            inline-template
            @open="chose"
          >
            <network network="whatsapp">
              <b-btn variant="primary" size="lg" class="whatsapp mt-1 mb-1">
                <v-icon name="brands/whatsapp" /> Whatsapp
              </b-btn>
            </network>
          </social-sharing>
          <div ref="container">
            <b-btn variant="info" size="lg" class="mt-1 mb-1" @click="doCopy">
              <v-icon v-if="copied" name="check" />
              <v-icon v-else name="copy" /> Copy
            </b-btn>
          </div>
          </div>
        </div>
      </div>
      <p class="mt-3 text-center text-muted">
        You can share your own posts at any time from <em>My Posts</em>.
      </p>
    </template>
    <template slot="modal-footer">
      <b-button variant="primary" @click="close">
        Close
      </b-button>
    </template>
  </b-modal>
</template>
<script>
import modal from '@/mixins/modal'
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import NoticeMessage from './NoticeMessage'

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

export default {
  components: { NoticeMessage },
  mixins: [modal],
  props: {
    id: {
      type: Number,
      required: true
    },
    maybe: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function() {
    return {
      shared: false,
      copied: false
    }
  },
  computed: {
    isApp() {
      return process.env.IS_APP
    },
    message() {
      return this.$store.getters['messages/get'](this.id)
    }
  },
  methods: {
    async show() {
      const last = this.$store.getters['misc/get']('sharemodal')

      if (this.maybe && last && Date.now() - last <= 1000 * 31 * 24 * 60 * 60) {
        // If we failed to share recently, don't ask again for a while.
        return
      }

      try {
        await this.$store.dispatch('messages/fetch', {
          id: this.id
        })

        this.showModal = true
      } catch (e) {
        // Must no longer exist on server.
        this.close()
      }
    },
    chose(type) {
      this.$api.bandit.chosen({
        uid: 'share',
        variant: type
      })
      this.shared = true
    },
    shareApp(){
      console.log('shareApp')
      this.$nextTick(() => {
        if (process.env.IS_APP) { // CC..
          console.log('shareApp this.message',this.message)
          const href = this.message.url
          const subject = 'Sharing ' + this.message.subject
          // https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
          const options = {
            message: this.message.textbody + "\n\n",  // not supported on some apps (Facebook, Instagram)
            subject: subject,                         // for email
            //files: ['', ''], // an array of filenames either locally or remotely
            url: href,
            //chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
          }

          const onSuccess = function (result) {
            console.log("Share completed? " + result.completed)   // On Android apps mostly return false even while it's true
            console.log("Shared to app: " + result.app)           // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
          }

          const onError = function (msg) {
            console.log("Sharing failed with message: " + msg)
          }

          window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError)
        }
      })

      this.shared = true
    },
    close() {
      if (this.shared) {
        // We have shared something this time.  Clear the data that says we don't want to share.
        this.$store.dispatch('misc/set', {
          key: 'sharemodal',
          value: null
        })
      } else {
        // We haven't shared.  Save this choice so that we might not show the modal next time.
        this.$store.dispatch('misc/set', {
          key: 'sharemodal',
          value: Date.now()
        })
      }

      this.showModal = false
    },
    async doCopy() {
      await this.$copyText(this.message.url, this.$refs.container)
      this.copied = true
      this.chose()
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

::v-deep .facebook {
  background-color: $color-facebook !important;
  color: white;
}

::v-deep .whatsapp {
  background-color: $color-whatsapp !important;
}

::v-deep .gmail {
  background-color: $color-gmail !important;
}

::v-deep .buttons button {
  width: 145px;
}
</style>
