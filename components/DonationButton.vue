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
      Donate <span v-if="show">{{ show }}</span>
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
      return 'https://freegle.in/' + this.link
    }
  },
  methods: {
    clicked() {
      this.$emit('clicked')
    }
  }
}
</script>
