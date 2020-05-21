<template>
  <b-modal
    id="sharemodal"
    v-model="showModal"
    title="Share your post"
    size="lg"
    no-stacking
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
        <social-sharing
          :url="message.url"
          :title="'Sharing ' + message.subject"
          :description="message.textbody"
          hashtags="freegle,free,reuse"
          inline-template
          @open="chose"
        >
          <div>
            <div class="d-flex flex-wrap justify-content-around mt-3">
              <network network="facebook">
                <b-btn variant="primary" size="lg" class="facebook">
                  <v-icon name="brands/facebook" /> Facebook
                </b-btn>
              </network>
              <network network="whatsapp">
                <b-btn variant="success" size="lg" class="whatsapp">
                  <v-icon name="brands/whatsapp" /> Whatsapp
                </b-btn>
              </network>
              <network network="twitter">
                <b-btn variant="primary" size="lg" class="twitter">
                  <v-icon name="brands/twitter" /> Twitter
                </b-btn>
              </network>
              <network network="email">
                <b-btn variant="success" size="lg" class="gmail">
                  <v-icon name="envelope" /> Email
                </b-btn>
              </network>
            </div>
            <!--          <div class="d-flex flex-wrap justify-content-around mt-2">-->
            <!--            <network network="skype">-->
            <!--              <b-btn variant="white">-->
            <!--                <v-icon name="brands/skype" /> Skype-->
            <!--              </b-btn>-->
            <!--            </network>-->
            <!--            <network network="sms">-->
            <!--              <b-btn variant="white">-->
            <!--                <v-icon name="comment" /> SMS-->
            <!--              </b-btn>-->
            <!--            </network>-->
            <!--            <network network="pinterest">-->
            <!--              <b-btn variant="white">-->
            <!--                <v-icon name="brands/pinterest" /> Pinterest-->
            <!--              </b-btn>-->
            <!--            </network>-->
            <!--            <network network="telegram">-->
            <!--              <b-btn variant="white">-->
            <!--                <v-icon name="brands/telegram" /> Telegram-->
            <!--              </b-btn>-->
            <!--            </network>-->
            <!--            <network network="googleplus">-->
            <!--              <b-btn variant="white">-->
            <!--                <v-icon name="brands/google-plus" /> Google+-->
            <!--              </b-btn>-->
            <!--            </network>-->
            <!--          </div>-->
          </div>
        </social-sharing>
        <p class="mt-3 text-center text-muted">
          You can also share later from <em>My Posts</em>.
        </p>
      </div>
    </template>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <b-button variant="white" @click="cancel">
        Close
      </b-button>
    </template>
  </b-modal>
</template>
<script>
import NoticeMessage from './NoticeMessage'

export default {
  components: { NoticeMessage },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      showModal: false
    }
  },
  computed: {
    message() {
      return this.$store.getters['messages/get'](this.id)
    }
  },
  methods: {
    async show() {
      try {
        await this.$store.dispatch('messages/fetch', {
          id: this.id
        })

        this.showModal = true

        this.$api.bandit.shown({
          uid: 'share',
          variant: 'facebook'
        })

        this.$api.bandit.shown({
          uid: 'share',
          variant: 'twitter'
        })

        this.$api.bandit.shown({
          uid: 'share',
          variant: 'whatsapp'
        })

        this.$api.bandit.shown({
          uid: 'share',
          variant: 'email'
        })
      } catch (e) {
        // Must no longer exist on server.
        this.hide()
      }
    },
    hide() {
      this.showModal = false
    },
    chose(type) {
      this.$api.bandit.chosen({
        uid: 'share',
        variant: type
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import 'color-vars';

::v-deep .facebook {
  background-color: $color-facebook !important;
}

::v-deep .twitter {
  background-color: $color-twitter !important;
}

::v-deep .whatsapp {
  background-color: $color-whatsapp !important;
}

::v-deep .gmail {
  background-color: $color-gmail !important;
}
</style>
