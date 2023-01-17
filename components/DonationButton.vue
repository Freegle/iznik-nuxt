<template>
  <div>
    <b-button
      variant="primary"
      size="lg"
      aria-label="Donate to Freegle with PayPal"
      @click="clicked"
    >
      <div class="d-flex align-items-center">
        <div :id="uniqueId" ref="paypalbutton" class="mr-2" @click="suppress" />
        <div v-if="!show">
          Donate
        </div>
        <div v-else>
          {{ show }}
        </div>
      </div>
    </b-button>
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'DonationButton',
  props: {
    directDonation: {
      type: Boolean,
      required: false,
      default: false
    },
    value: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      uniqueId: null
    }
  },
  computed: {
    buttonId() {
      // These are set up at https://www.paypal.com/donate/buttons/manage
      switch (this.value) {
        case '1':
          return 'BA7SYG5KVH4WW'
        case '1510':
          return 'XEFBZCF2RDEQ8'
        case '2':
          return 'S3RKX5JHQUUL4'
        case '2510':
          return 'KSDKLE7WBW2X2'
        case '3':
          return 'L4GDMEU6FMNFJ'
        case '5':
          return '92MLE3SKST546'
        case '10':
          return 'KTNBE4YMDUGUY'
        case '25':
          return 'D5P8XMVRDLC7N'
        case 'any':
          // Any amount.
          return '2DZ6YUDERBVKC'
        default:
          // And whatyoucan.  Works better to suggest amounts.
          return 'KSDKLE7WBW2X2'
      }
    },
    show() {
      return this.value ? '£' + this.value : this.$props.show
    }
  },
  async mounted() {
    const self = this
    this.uniqueId =
      'donate-' + (await this.$store.dispatch('uniqueid/generate'))
    await Vue.loadScript(
      'https://www.paypalobjects.com/donate/sdk/donate-sdk.js'
    )

    // eslint-disable-next-line no-undef
    PayPal.Donation.Button({
      env: 'production',
      hosted_button_id: this.buttonId,
      image: {
        src: '/pp_cc_mark_37x23.jpg',
        title: 'Donate ' + (this.show ? this.show : '') + ' with PayPal',
        alt: 'Donate ' + (this.show ? this.show : '') + ' with PayPal'
      },
      onComplete(params) {
        // Because we get a callback we can record the actual amount donated.
        console.log('Donation completed with', params)
        self.$emit('clicked', params.amt)
      }
    }).render('#' + this.uniqueId)
  },
  methods: {
    suppress(e) {
      // Stop clicking on the PayPal button itself triggering the button click which will click the PayPal button.
      e.stopPropagation()
    },
    clicked() {
      this.$refs.paypalbutton.firstChild.click()
    },
    async donateMonthly() {
      await this.$refs.donateform.submit()
      this.$emit('clicked')
    }
  }
}
</script>
