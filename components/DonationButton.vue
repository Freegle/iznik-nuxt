<template>
  <div>
    <div v-if="monthly" @click="donateMonthly">
      <b-button
        variant="primary"
        size="lg"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Donate to Freegle with PayPal (opens in a new tab)"
      >
        <b-img alt="" src="~/static/pp_cc_mark_37x23.jpg" class="mr-2 d-none d-sm-inline" />
        <span v-if="!show">Donate </span><span v-if="show">{{ show }}</span>
      </b-button>
      <form ref="donateform" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
        <input type="hidden" name="cmd" value="_s-xclick">
        <input type="hidden" name="hosted_button_id" value="6VJKBWQ9RQHPU">
        <input type="hidden" name="os0" :value="monthlyvalue">
        <input type="hidden" name="on0" value="">
        <input type="hidden" name="currency_code" value="GBP">
        <img alt="" border="0" src="https://www.paypalobjects.com/en_GB/i/scr/pixel.gif" width="1" height="1">
      </form>
    </div>
    <div v-else @click="clicked">
      <b-button
        variant="primary"
        size="lg"
        :href="donationLink"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Donate to Freegle with PayPal (opens in a new tab)"
      >
        <b-img alt="" src="~/static/pp_cc_mark_37x23.jpg" class="mr-2 d-none d-sm-inline" />
        <span v-if="!show">Donate </span><span v-if="show">{{ show }}</span>
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DonationButton',
  props: {
    directDonation: {
      type: Boolean,
      required: false,
      default: false
    },
    link: {
      type: String,
      required: false,
      default: null
    },
    show: {
      type: String,
      required: false,
      default: null
    },
    monthly: {
      type: Boolean,
      required: false,
      default: false
    },
    monthlyvalue: {
      type: String,
      required: false,
      default: null
    }
  },
  computed: {
    donationLink() {
      return 'https://freegle.in/' + (this.link || 'paypal1510')
    }
  },
  methods: {
    clicked() {
      if (process.env.IS_APP) {
        // eslint-disable-next-line no-undef
        cordova.InAppBrowser.open(this.href, '_system')
        return false
      }

      this.$emit('clicked')
    },
    async donateMonthly() {
      await this.$refs.donateform.submit()

      this.$emit('clicked')
    }
  }
}
</script>
