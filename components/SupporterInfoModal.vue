<template>
  <div>
    <client-only>
      <b-modal
        id="supportermodal"
        v-model="showModal"
        title="What are Freegle Supporters?"
      >
        <template slot="default">
          <p>
            We're free to use, but we're not free to run.  To keep running, we need volunteer time, and we need
            charity funds.
          </p>
          <p>
            We know some people can give one and not the other.  We want everyone
            to be able to help if they're able.
          </p>
          <p>
            If you've donated either recently, then we'll thank you with the Supporter badge.  People
            will see you're a committed freegler.
          </p>
          <div class="d-flex justify-content-between flex-wrap">
            <DonationButton link="paypal1510" class="mt-2" />
            <div class="align-self-center">
              <b-btn variant="secondary" size="lg" :disabled="amMicroVolunteering" @click="donateTime">
                <span v-if="amMicroVolunteering" class="text-wrap">
                  Donating time.  Thanks!
                </span>
                <span v-else>
                  Donate time
                </span>
              </b-btn>
            </div>
          </div>
        </template>
        <template slot="modal-footer" slot-scope="{ ok, cancel }">
          <b-button variant="white" @click="cancel">
            Close
          </b-button>
        </template>
      </b-modal>
    </client-only>
  </div>
</template>
<script>
import modal from '@/mixins/modal'
import DonationButton from '@/components/DonationButton'

export default {
  components: { DonationButton },
  mixins: [modal],
  methods: {
    donateTime() {
      // Turn microvolunteering on.
      this.$store.dispatch('misc/set', {
        key: 'microvolunteeringinviteaccepted',
        value: Date.now()
      })

      this.$store.dispatch('user/edit', {
        id: this.myid,
        trustlevel: 'Basic'
      })
    }
  }
}
</script>
