<template>
  <b-row class="m-0">
    <b-col cols="0" md="3" />
    <b-col cols="12" md="6" class="mt-2">
      <b-card no-body variant="success">
        <b-card-header>
          <h1>Please vote for Freegle!</h1>
        </b-card-header>
        <b-card-text class="p-2">
          <p>
            You can help Freegle win much-needed funds to keep us going - <b>without it costing you a penny!</b>
          </p>
          <p>
            PayPal Giving Fund are giving away up to &pound;6,000 to the charities that get the most people to choose them as their
            favourite charity on PayPal during April.  <b>You don't need to donate</b> - setting us as your favourite charity counts
            as a vote for us to win.
          </p>
          <b-btn variant="primary" size="lg" to="https://www.paypal.com/signin?returnUri=https%3A%2F%2Fwww.paypal.com%2Ffundraiser%2Fcharity%2F55681%3FsetPreferred%3Dtrue">
            Click here to set Freegle as your favourite charity
          </b-btn>
          <p class="mt-2">
            <b>Sign in to PayPal, if it asks, and then it should set Freegle as your favourite charity.</b>
          </p>
          <p>
            Once you <b>see the little red heart</b>, that counts as a vote -
          </p>
          <b-img-lazy fluid src="/PayPalFavourite.gif" />
          <p class="mt-3">
            The PayPal page doesn't mention this competition but you can read more about it <ExternalLink href="https://newsroom.uk.paypal-corp.com/onetapbigimpact">
              here
            </ExternalLink>.
          </p>
        </b-card-text>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import buildHead from '@/mixins/buildHead.js'
import loginOptional from '@/mixins/loginOptional.js'
import ExternalLink from '@/components/ExternalLink'

export default {
  components: { ExternalLink },
  mixins: [buildHead, loginOptional],
  head() {
    return this.buildHead(
      'Vote for Freegle',
      'Help Freegle win much-needed funds - without it costing you a penny!'
    )
  }
}
</script>
