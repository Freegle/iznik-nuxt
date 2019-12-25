<template>
  <b-modal
    id="promisemodal"
    v-model="showModal"
    :title="message.subject"
    size="lg"
    no-stacking
  >
    <template slot="default">
      <social-sharing
        :url="message.url"
        :title="'Sharing ' + message.subject"
        :description="message.textbody"
        hashtags="freegle,free,reuse"
        inline-template
      >
        <div>
          <p>You can share using these buttons:</p>
          <b-list-group horizontal class="flex-wrap">
            <b-list-group-item>
              <network network="facebook">
                <b-btn variant="white">
                  <v-icon name="brands/facebook" /> Facebook
                </b-btn>
              </network>
            </b-list-group-item>
            <b-list-group-item>
              <network network="twitter">
                <b-btn variant="white">
                  <v-icon name="brands/twitter" /> Twitter
                </b-btn>
              </network>
            </b-list-group-item>
            <b-list-group-item>
              <network network="whatsapp">
                <b-btn variant="white">
                  <v-icon name="brands/whatsapp" /> Whatsapp
                </b-btn>
              </network>
            </b-list-group-item>
            <b-list-group-item>
              <network network="pinterest">
                <b-btn variant="white">
                  <v-icon name="brands/pinterest" /> Pinterest
                </b-btn>
              </network>
            </b-list-group-item>
            <b-list-group-item>
              <network network="telegram">
                <b-btn variant="white">
                  <v-icon name="brands/telegram" /> Telegram
                </b-btn>
              </network>
            </b-list-group-item>
            <b-list-group-item>
              <network network="sms">
                <b-btn variant="white">
                  <v-icon name="comment" /> SMS
                </b-btn>
              </network>
            </b-list-group-item>
            <b-list-group-item>
              <network network="email">
                <b-btn variant="white">
                  <v-icon name="envelope" /> Email
                </b-btn>
              </network>
            </b-list-group-item>
            <b-list-group-item>
              <network network="skype">
                <b-btn variant="white">
                  <v-icon name="brands/skype" /> Skype
                </b-btn>
              </network>
            </b-list-group-item>
            <b-list-group-item>
              <network network="googleplus">
                <b-btn variant="white">
                  <v-icon name="brands/google-plus" /> Google+
                </b-btn>
              </network>
            </b-list-group-item>
          </b-list-group>
        </div>
      </social-sharing>
    </template>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <b-button variant="white" @click="cancel">
        Close
      </b-button>
    </template>
  </b-modal>
</template>

<style scoped>
</style>

<script>
// There are a bunch of icons we need only rarely.  By requiring them here we avoid
// requiring them in the vue-awesome plugin.  That makes them available everywhere - but
// increases the bundle size.  Putting them here allows better bundling.
export default {
  components: {},
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      showModal: false
    }
  },
  computed: {},
  mounted() {},
  methods: {
    show(type) {
      this.showModal = true
    },

    hide() {
      this.showModal = false
    }
  }
}
</script>
