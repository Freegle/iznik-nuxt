<template>
  <b-row class="m-0">
    <b-col cols="0" md="3" />
    <b-col cols="12" md="6" class="mt-2">
      <b-card no-body variant="success">
        <b-card-header>
          <h1>Free To Use - Not Free To Run!</h1>
        </b-card-header>
        <b-card-text class="p-2">
          <DonationThermometer v-if="false" ref="thermo" class="float-right text-center" />
          <p>Thank you!  It's nice of you to even think about supporting us.</p>
          <p>
            We provide a free service and keep costs low thanks to our
            large number of committed volunteers - but there are some things we have to pay for to keep going.
          </p>
          <p>
            Freegle is relatively unusual, especially in the charity world. Most websites host read-only
            content which changes quite rarely, for a relatively small number of active users. We have an active
            service where there are changes happening continuously, and we send out hundreds of thousands of emails
            a day. You can certainly get a cheap and cheerful charity website that doesn’t do much for a few quid a
            year, but you can’t run something like Freegle that way.  It’s a different kettle of fish.
            It’s not even a kettle, and they’re not fish.
          </p>
          <p v-if="false" class="font-weight-bold">
            This month we're trying to raise &pound;{{ target }} from donations - can you help?
          </p>
          <h3>If you can, please donate &pound;3.</h3>
          <p>...but anything you can give is very welcome.</p>
          <donation-button :direct-donation="true" />
        </b-card-text>
      </b-card>
      <b-card no-body variant="success" class="mt-2">
        <b-card-header>
          <h2>Please set us as your favourite PayPal charity</h2>
        </b-card-header>
        <b-card-text class="p-2">
          <p>
            This will make it easier to donate a little to Freegle when you're checking out using PayPal.  Go to our page
            on PayPal Giving Fund and click the <strong>Set as favourite charity</strong> link.
          </p>
          <ExternalLink href="https://www.paypal.com/fundraiser/charity/55681">
            <b-btn variant="primary" size="lg" class="mb-2">
              Go to PayPal Giving Fund
            </b-btn>
          </ExternalLink>
          <p>
            Here's how it looks:
          </p>
          <b-img-lazy fluid src="/PayPalFavourite.gif" />
        </b-card-text>
      </b-card>
      <p />
      <h2 class="mt-2">
        Other ways to Donate
      </h2>
      <b-row>
        <b-col cols="12" lg="6">
          <b-card class="mt-2 mb-2" no-body variant="success">
            <b-card-header>
              Bank Transfer
            </b-card-header>
            <b-card-text class="p-2">
              <p>
                You can also donate by bank transfer to sort code 60-83-01, account number 20339094.  The name
                of the account is Freegle Limited, and the bank is Unity Trust Bank.
              </p>
              <p>
                If you do this, please complete a Gift Aid
                <!-- eslint-disable-next-line -->
                Declaration <nuxt-link to="/giftaid">here</nuxt-link>.
              </p>
            </b-card-text>
          </b-card>
        </b-col>
        <b-col cols="12" lg="6">
          <b-card class="mt-2 mb-2" no-body variant="success">
            <b-card-header>
              By Cheque
            </b-card-header>
            <b-card-text class="p-2">
              <p>
                You can donate by cheque.
              </p>
              <p>
                Please make it payable to Freegle Limited and send to Freegle, 64A North Road, Ormesby, Great Yarmouth NR29 3LE.  Please
                include your Freegle email, so we can work out who it comes from!
              </p>
              <p>
                If you do this, please complete a Gift Aid
                <!-- eslint-disable-next-line -->
                Declaration <nuxt-link to="/giftaid">here</nuxt-link>.
              </p>
            </b-card-text>
          </b-card>
        </b-col>
        <b-col cols="12" lg="6">
          <b-card class="mt-2 mb-2" no-body variant="success">
            <b-card-header>
              Online Shopping
            </b-card-header>
            <b-card-text class="p-2">
              <p>
                You can support us for free when you shop using
                <a target="_blank" rel="noopener" href="https://www.giveasyoulive.com/join/freegle">
                  Give As You Live
                </a>.
              </p>
              <p>Please click here to find out more:</p>
              <a target="_blank" rel="noopener" href="https://www.giveasyoulive.com/join/freegle">
                <b-img fluid alt="Give As You Live" class="img-rounded img-responsive" src="/GAYL.gif" />
              </a>
            </b-card-text>
          </b-card>
        </b-col>
        <b-col cols="12" lg="6">
          <b-card class="mt-2 mb-2" no-body variant="success">
            <b-card-header>
              On eBay
            </b-card-header>
            <b-card-text class="p-2">
              <p>
                You can also help us when you sell on <strong>eBay</strong>.  Make sure you're signed in to eBay, then click
                below and <em>Save as favourite</em>.
              </p>
              <a href="http://www.ebay.co.uk/egw/ebay-for-charity/charity-profile/Freegle/74430" target="_blank" rel="noopener">
                <b-img fluid class="img-rounded img-responsive" src="/ebayvote.PNG" />
              </a>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import buildHead from '@/mixins/buildHead.js'
import DonationThermometer from '../components/DonationThermometer'
import DonationButton from '../components/DonationButton'
import ExternalLink from '../components/ExternalLink'

export default {
  components: {
    ExternalLink,
    DonationThermometer,
    DonationButton
  },
  mixins: [buildHead],
  computed: {
    target() {
      return this.$store.getters['donations/target']
    }
  },
  head() {
    return this.buildHead(
      'Donate to Freegle',
      "We're free to use, but not free to run.  Can you help us keep going?"
    )
  }
}
</script>
