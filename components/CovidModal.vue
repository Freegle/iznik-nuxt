<template>
  <div>
    <client-only>
      <b-modal
        id="covidmodal"
        v-model="showModal"
        title="Thanks"
        no-stacking
      >
        <template slot="default">
          <p>Thanks, we've recorded your interest.</p>
          <p>Like we said, we don't know if this will work out.  But it's worth a try.  Thanks for freegling.</p>
          <social-sharing
            url="https://www.ilovefreegle.org/covid"
            title="COVID-19 - Can you help?"
            description="Over the next couple of months, quite a lot of people may be ill and need help with practical things like shopping and medicines.  Maybe not yet, but maybe soon.  Can you help?"
            hashtags="covid19"
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
          <b-button variant="success" @click="cancel">
            Close
          </b-button>
        </template>
      </b-modal>
    </client-only>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      showModal: false
    }
  },
  methods: {
    show() {
      this.showModal = true
    },
    hide() {
      this.showModal = false
    }
  }
}
</script>
