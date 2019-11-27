<template>
  <b-row class="m-0">
    <b-col cols="0" md="3" />
    <b-col cols="12" md="6" class="mt-2">
      <b-card no-body variant="success">
        <b-card-header>
          <h1>Free To Use - Not Free To Run!</h1>
        </b-card-header>
        <b-card-text class="p-2">
          <DonationThermometer ref="thermo" class="float-right text-center" />
          <p>Thank you!  It's nice of you to even think about supporting us.</p>
          <p>
            We provide a free service and keep costs <em>phenomenally</em> low thanks to our
            large number of committed volunteers - but there are some things we have to pay for to keep going.
          </p>
          <p><b>This month we're trying to raise &pound;{{ target }} from donations - can you help?</b></p>
          <h3>If you can, please donate &pound;3.</h3>
          <p>...but anything you can give is very welcome.</p>
          <a target="_blank" rel="noopener" href="https://freegle.in/paypalbutton">
            <b-btn variant="primary" size="lg">
              <b-img alt="PayPal" thumbnail src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" />
              &nbsp;Donate
            </b-btn>
          </a>
        </b-card-text>
      </b-card>
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
                You can also donate by bank transfer to sort code 60-83-01, account number 20339094.
              </p>
              <p>
                If you do this, please complete a Gift Aid
                Declaration <a target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSfSWQ_hlOflsS6AfwPEmIlYxLuf1u5-iDspZKr20K-yj1hrVQ/viewform">here</a>.
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
                Please make it payable to Freegle Limited and send to Freegle, 150 Whitecross, Abingdon, Oxon, OX13 6BT.
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
                You can also help us when you sell on <b>eBay</b>.  Make sure you're signed in to eBay, then click
                below and <em>Save as favourite</em>.
              </p>
              <a href="http://www.ebay.co.uk/egw/ebay-for-charity/charity-profile/Freegle/74430" target="_blank" rel="noopener">
                <b-img fluid class="img-rounded img-responsive" src="/ebayvote.PNG" />
              </a>
            </b-card-text>
          </b-card>
        </b-col>
        <b-col cols="12" lg="6">
          <b-card class="mt-2 mb-2" no-body variant="success">
            <b-card-header>
              Virgin Money Giving
            </b-card-header>
            <b-card-text class="p-2">
              <p>Or you can donate using Virgin:</p>
              <a target="_blank" rel="noopener" href="http://uk.virginmoneygiving.com/charity-web/charity/finalCharityHomepage.action?charityId=1005493">
                <img alt="Virgin Money Giving" src="/vmg.png">
              </a>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>
<script>
import DonationThermometer from '../components/DonationThermometer'
export default {
  components: { DonationThermometer },
  computed: {
    target() {
      return this.$store.getters['donations/target']
    }
  }
}
</script>
