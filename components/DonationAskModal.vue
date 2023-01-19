<template>
  <div>
    <b-modal
      id="donationaskemodal"
      v-model="showModal"
      :title="'Please help keep ' + groupname + ' running'"
      size="lg"
      no-stacking
    >
      <template slot="default">
        <div v-if="variant === 'video'">
          <p class="font-weight-bold">
            We've made little video to explain why we ask for donations.  It's
            just this guy Edward in his living room, because we don't waste your money on fancy PR agencies.
          </p>
          <div class="embed-responsive embed-responsive-16by9">
            <!--            <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/ZUIKkKkKVkQ" allowfullscreen />-->
            <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/TByrRQdLVD8" allowfullscreen />
          </div>
          <client-only>
            <p class="font-weight-bold text-center mt-4">
              If you're able to donate to help us keep going, that would be lovely.  Monthly donations are particularly
              helpful.
            </p>
            <p class="text-center mt-1">
              Click the amount to donate:
            </p>
            <div class="d-flex flex-wrap justify-content-between mt-2">
              <donation-button value="2" class="mb-1" @clicked="score(2)" />
              <donation-button value="5" class="mb-1" @clicked="score(5)" />
              <donation-button value="10" class="mb-1" @clicked="score(10)" />
            </div>
          </client-only>
        </div>
        <div v-else>
          <div class="d-flex justify-content-between">
            <div v-if="variant === 'whatyoucanrunning'" style="width:250px" class="mr-4 pt-4 d-none d-sm-block">
              <b-img-lazy fluid src="/running.gif" alt="Keep freegle running" />
            </div>
            <div>
              <p v-if="variant === 'paypal1510minutes'">
                <strong>£1</strong> keeps Freegle running across the UK for <strong>7 minutes</strong>.  Can you help?
              </p>
              <div v-else>
                <div v-if="variant === 'quote'">
                  <p>
                    Freegler Mary writes:
                  </p>
                  <!-- eslint-disable-next-line -->
                  <p class="quote">I pass on my unwanted items here as I hate waste with a passion! It's a last resort to bin it! I also donate to Freegle via Paypal as it's my way of saying thank you for all the free items and to make sure Freegle is kept going.</p>
                  <p>
                    Could you be like Mary and help us keep going?
                  </p>
                </div>
                <p v-else>
                  <strong>{{ groupname }}</strong> is a charity that's free to use, but not free to run.  This month we're
                  trying to raise <strong>&pound;{{ target }}</strong><span v-if="groupid && !targetMet"> for this community</span><span v-else> across the UK</span>.
                </p>
              </div>
              <p>
                If you can, <strong>
                  <span v-if="variant === 'link1' || variant === 'buttons1'">
                    please donate &pound;1
                  </span>
                  <span v-else-if="variant === 'link3' || variant === 'buttons3'">
                    please donate &pound;3
                  </span>
                  <span v-else-if="variant === 'buttonsmonthly'">
                    please set up a monthly donation
                  </span>
                  <span v-else-if="variant === 'buttons1510' || variant === 'buttons51025' || variant === 'buttons2510' || variant === 'quote'">
                    please donate
                  </span>
                  <span v-else>
                    <!--                  "variant === 'whatyoucan'"-->
                    please donate what you can
                  </span>
                </strong>
                to keep us running.
              </p>
              <div class="mt-2 mb-4 d-flex border border-secondary rounded p-2">
                <Supporter size="lg" class="mr-2 align-self-center" />
                <div>
                  You'll get a cute little badge so that other people can see you're a committed
                  freegler.
                </div>
              </div>

              <donation-button v-if="variant === 'whatyoucanrunning'" value="1510" @clicked="score(5)" />
              <donation-button v-else-if="variant === 'link1'" value="1" @clicked="score(1)" />
              <donation-button v-else-if="variant === 'link3'" value="3" @clicked="score(3)" />
              <donation-button v-else-if="variant === 'buttons1'" value="1" @clicked="score(1)" />
              <donation-button v-else-if="variant === 'buttons3'" value="3" @clicked="score(3)" />
              <div v-else-if="variant === 'buttons1510' || variant === 'quote'" class="d-flex justify-content-between flex-wrap">
                <donation-button value="1" class="mb-1" @clicked="score(1)" />
                <donation-button value="5" class="mb-1" @clicked="score(5)" />
                <donation-button value="10" class="mb-1" @clicked="score(10)" />
              </div>
              <div v-else-if="variant === 'paypal1510minutes'" class="d-flex justify-content-between flex-wrap">
                <donation-button value="1" class="mb-1" @clicked="score(1)" />
                <donation-button value="5" class="mb-1" @clicked="score(5)" />
                <donation-button value="10" class="mb-1" @clicked="score(10)" />
              </div>
              <div v-else-if="variant === 'buttons2510'" class="d-flex justify-content-between flex-wrap">
                <donation-button value="2" class="mb-1" @clicked="score(2)" />
                <donation-button value="5" class="mb-1" @clicked="score(5)" />
                <donation-button value="10" class="mb-1" @clicked="score(10)" />
              </div>
              <div v-else-if="variant === 'buttons51025'" class="d-flex justify-content-between flex-wrap">
                <donation-button value="5" class="mb-1" @clicked="score(5)" />
                <donation-button value="10" class="mb-1" @clicked="score(10)" />
                <donation-button value="25" class="mb-1" @clicked="score(25)" />
              </div>
              <!--            if="variant === 'whatyoucan'"-->
              <donation-button v-else link="paypal1510" @clicked="score(5)" />
              <p class="mt-2">
                <!-- eslint-disable-next-line -->
                Anything you can give is very welcome. You can find other ways to donate (e.g. bank transfer or cheque) <nuxt-link to="/donate">here</nuxt-link>.
              </p>
              <p v-if="groupid && !targetMet" class="text-muted small mt-1">
                This will contribute to the general fund for the ongoing support of Freegle.  If we raise more than the
                target, we'll use it to support other communities.
              </p>
              <div v-if="variant === 'whatyoucanrunning'" class="w-100 d-flex justify-content-center">
                <img src="/running.gif" alt="Keep freegle running" class="d-block d-sm-none img-fluid " width="200">
              </div>
            </div>
            <DonationThermometer ref="thermo" :groupid="groupid" class="ml-md-4" />
          </div>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button variant="secondary" @click="cancel">
          Close
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import modal from '@/mixins/modal'
import DonationThermometer from './DonationThermometer'
import DonationButton from './DonationButton'
import Supporter from '~/components/Supporter'

export default {
  components: {
    Supporter,
    DonationThermometer,
    DonationButton
  },
  mixins: [modal],
  props: {
    groupid: {
      type: Number,
      required: false,
      default: null
    }
  },
  data: function() {
    return {
      variant: null,
      monthly: false
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
    async show(type) {
      // We need to decide which variant of donation ask to show.
      this.variant = 'buttons1'

      try {
        const variant = await this.$api.bandit.choose({
          uid: 'donation'
        })

        if (variant) {
          this.variant = variant.variant
        }
      } catch (e) {
        console.error('Get variant failed')
      }

      this.showModal = true

      // Record the show
      this.$api.bandit.shown({
        uid: 'donation',
        variant: this.variant
      })
    },
    score(value) {
      this.$api.bandit.chosen({
        uid: 'donation',
        variant: this.variant,
        score: value
      })
    }
  }
}
</script>
<style scoped lang="scss">
.quote {
  font-size: 1.25rem;
  font-weight: bold;
  font-style: italic;

  &::before {
    content: open-quote;
  }

  &::after {
    content: close-quote;
  }
}
</style>
