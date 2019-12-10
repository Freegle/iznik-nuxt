<template>
  <b-modal
    id="donationaskemodal"
    v-model="showModal"
    :title="'Please help keep ' + groupname + ' running'"
    size="lg"
    no-stacking
  >
    <template slot="default">
      <b-row>
        <b-col>
          <DonationThermometer ref="thermo" class="float-right text-center" :groupid="groupid" />
          <p>
            <b>{{ groupname }}</b> is a charity that's free to use, but not free to run.
          </p>
          <p>
            This month we're trying to raise <b>&pound;{{ target }}</b><span v-if="groupid && !targetMet"> for this community</span>.
            If you can, <b>please donate &pound;3</b> to keep us running - but anything you can give is very welcome.
          </p>
          <a href="https://freegle.in/paypalfundraiser" target="_blank">
            <b-btn variant="primary" size="lg">
              <b-img thumbnail alt="PayPal" src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" />
              &nbsp;Donate
            </b-btn>
          </a>
          <p class="mt-2">
            A <a target="_blank" href="https://freegle.in/paypalbutton">monthly donation</a> of &pound;1 would really help.
            You can find other ways to donate (e.g. bank transfer or cheque) <nuxt-link to="/donate">
              here
            </nuxt-link>.
          </p>
          <p v-if="groupid && !targetMet" class="text-muted small mt-1">
            This will contribute to the general fund for the ongoing support of Freegle.  If we raise more than the
            target, we'll use it to support other communities.
          </p>
        </b-col>
      </b-row>
    </template>
    <template slot="modal-footer" slot-scope="{ cancel }">
      <b-button variant="success" @click="cancel">
        Close
      </b-button>
    </template>
  </b-modal>
</template>
<style scoped lang="scss">
</style>

<script>
import DonationThermometer from './DonationThermometer'

export default {
  components: {
    DonationThermometer
  },
  props: {
    groupid: {
      type: Number,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      showModal: false
    }
  },
  computed: {
    groupname() {
      if (this.groupid && !this.targetMet) {
        const group = this.$store.getters['group/get'](this.groupid)

        if (group) {
          return group.namedisplay
        }
      }

      return 'Freegle'
    },
    target() {
      return this.$store.getters['donations/target']
    },
    raised() {
      return this.$store.getters['donations/raised']
    },
    targetMet() {
      // Have we met our per group target?  If so then we'll do a global donation appeal.
      return this.groupid && this.raised > this.target
    }
  },
  async mounted() {
    if (this.groupid) {
      await this.$store.dispatch('group/fetch', {
        id: this.groupid
      })
    }
  },
  methods: {
    show(type) {
      this.showModal = true
    },

    hide() {
      this.showModal = false
    }
  }
}
</script>
