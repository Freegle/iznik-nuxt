<template>
  <div @click="clicked">
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
    <div v-if="monthly" class="text-success font-weight-bold">
      You'll need to click the monthly box on the next page
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
    }
  }
}
</script>
