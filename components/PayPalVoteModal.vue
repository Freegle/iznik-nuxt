<template>
  <b-modal
    id="profilemodal"
    v-model="showModal"
    size="lg"
  >
    <template slot="modal-header">
      <h2>
        Can you do us a favour?
      </h2>
    </template>
    <template slot="default">
      <p>
        You can help Freegle win much-needed funds to keep us going - <b>without it costing you a penny!</b>
      </p>
      <p>
        Our friends at PayPal are running a competition to feature the charities that get the <b>most votes</b> from now
        until <b>30th June</b>. With your help we've done well in similar competitions in previous years, and so we know that this can
        really make a big difference for us - and help us help more people.
      </p>
      <p>
        <b>Please click here:</b>
      </p>
      <ExternalLink href="https://freegle.in/VoteForFreegle2022">
        <b-btn variant="primary" size="lg">
          Vote for Freegle
        </b-btn>
      </ExternalLink>
      <p class="mt-2">
        Then click on <b>Freegle</b>, enter your email address (which they won't keep) and don't forget to click the Submit
        button.  It should <b>take about 30 seconds</b> and each vote will help!
      </p>
      <p>
        If you've already done this, then thanks very much - we don't have any way to know that.
      </p>
    </template>
    <template slot="modal-footer" slot-scope="{ ok, cancel }">
      <div class="d-flex justify-content-between w-100">
        <ExternalLink href="https://freegle.in/paypal1510">
          <b-btn variant="secondary">
            Donate directly via PayPal
          </b-btn>
        </ExternalLink>
        <b-button variant="secondary" @click="cancel">
          Cancel
        </b-button>
      </div>
    </template>
  </b-modal>
</template>
<script>
import modal from '@/mixins/modal'
import ExternalLink from '~/components/ExternalLink'

export default {
  components: {
    ExternalLink
  },
  mixins: [modal],
  methods: {
    show() {
      const already = this.$store.getters['misc/get']('paypal2022')

      if (!already) {
        this.$store.dispatch('misc/set', {
          key: 'paypal2022',
          value: true
        })

        this.showModal = true
      }
    }
  }
}
</script>
<style scoped lang="scss">
</style>
