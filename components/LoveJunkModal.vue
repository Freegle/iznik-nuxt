<template>
  <div>
    <b-modal
      id="lovejunkmodal"
      v-model="showModal"
      title="Paid removal via our friends at LoveJunk"
      size="lg"
      no-stacking
    >
      <template slot="default">
        <div class="text-center">
          <p>
            Not shown to members yet - still under development.
          </p>
          <p>
            Freegling is best.  But if you need it gone, then our friends at LoveJunk
            can arrange a paid pickup.
          </p>
          <b-img fluid src="/lovejunk.png" />
          <p class="mt-2">
            LoveJunk matches you to the cheapest nearby licensed waste collector or reuse organisation.  Collection
            rates start at &pound;10.  Freegle receives 5%, so you're helping keep us running at the same time.
          </p>
          <p>
            So if you can't freegle it, using LoveJunk is a great alternative.
          </p>
          <div class="d-flex justify-content-center">
            <b-btn variant="primary" size="lg" class="mt-2" @click="listIt">
              List on LoveJunk
            </b-btn>
          </div>
          <p class="mt-4">
            This will pass the details of your item and your postcode, but no other personal data, to LoveJunk.
          </p>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="secondary" @click="cancel">
          Cancel
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import modal from '@/mixins/modal'

export default {
  mixins: [modal],
  props: {
    message: {
      type: Object,
      required: true,
      default: null
    }
  },
  data: function() {
    return {
      showModal: false
    }
  },
  methods: {
    show() {
      // We need to decide which variant of donation ask to show.
      this.showModal = true

      // Record the show
      this.$api.bandit.shown({
        uid: 'lovejunk',
        variant: 'modal'
      })
    },
    async listIt() {
      this.$api.bandit.chosen({
        uid: 'lovejunk',
        variant: 'modal'
      })

      // bookings.lovejunk.com/freegle/[freegleid]
      await this.$store.dispatch('messages/partnerConsent', {
        id: this.message.id,
        partner: 'lovejunk.com'
      })

      window.open(
        'https://bookings-staging.lovejunk.com/freegle/' +
          this.message.id +
          '?signature=' +
          this.message.lovejunkhash
      )

      this.hide()
    }
  }
}
</script>
