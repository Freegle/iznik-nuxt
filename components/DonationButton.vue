<template>
  <b-button
    variant="primary"
    size="lg"
    :href="donationLink"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Donate to Freegle with PayPal (opens in a new tab)"
  >
    <b-img alt="" src="~/static/pp_cc_mark_37x23.jpg" class="mr-2" />
    Donate
  </b-button>
</template>

<script>
export default {
  name: 'DonationButton',
  props: {
    directDonation: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    donationLink() {
      return 'http://freegle.in/paypalbutton1325'
      // return this.directDonation
      //   ? 'https://freegle.in/paypalbutton'
      //   : 'https://freegle.in/paypalfundraiser'
    }
  }
}
</script>
