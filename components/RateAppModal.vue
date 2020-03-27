<template>
  <b-modal
    id="rateappmodal"
    v-model="showModal"
    title="Please help - Rate this App!"
    no-stacking
  >
    <template slot="default">
      <b-row>
        <b-col>
          <p>
            If you like Freegle - or not - please rate and review this app.
            This will help others start Freegling, saving money, time and the planet.
          </p>
          <p>Tap the button below to go to the Play Store or App Store - look for "Rate this app" or the "Reviews" tab.</p>
          <p>Note that the review option may not be available in some cases (not our fault).</p>
        </b-col>
      </b-row>
    </template>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <b-button variant="white" @click="notagain">
        Don't ask again
      </b-button>
      <b-button variant="white" @click="cancel">
        Not now
      </b-button>
      <b-button variant="success" @click="confirm">
        Rate now
      </b-button>
    </template>
  </b-modal>
</template>
<script>
import { mobilestate } from '@/plugins/app-init-push'
export default {
  data: function() {
    return {
      showModal: false
    }
  },
  methods: {
    show(type) {
      this.showModal = true
    },

    hide() {
      this.showModal = false
    },

    notagain() {
      window.localStorage.setItem('rateappnotagain',true)
      this.hide()
    },

    confirm() {
      let review_link = "market://details?id=org.ilovefreegle.direct";
      if (mobilestate.isiOS) review_link = "itmss://itunes.apple.com/us/app/freegle/id970045029?ls=1&mt=8&ign-mscache=1";
      console.log('rateApp.vue: ', review_link)
      cordova.InAppBrowser.open(review_link, '_system')
      this.hide()
    }
  }
}
</script>
