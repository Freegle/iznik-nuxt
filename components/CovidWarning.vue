<template>
  <NoticeMessage v-if="show" variant="danger">
    <!--    <b-btn variant="link" class="float-right" @click="hideit">-->
    <!--      Hide this-->
    <!--    </b-btn>-->
    <p>
      We're back!  Tips and recycling centres are re-opening, and the <a rel="noopener noreferrer" target="_blank" href="https://www.gov.uk/government/publications/coronavirus-covid-19-advice-to-local-authorities-on-prioritising-waste-collections/managing-household-waste-and-recycling-centres-hwrcs-in-england-during-the-coronavirus-covid-19-pandemic">government advice</a> allows online platforms such as ours.
    </p>
    <p>
      We hope you and yours are safe.  Please freegle responsibly and help keep it that way.
    </p>
    <b-btn variant="primary" @click="showModal = true">
      Read our advice on safe freegling
    </b-btn>
    <b-modal v-model="showModal" ok-only size="lg" title="Safe Freegling" ok-title="Close">
      <p>
        As tips and recycling centres start to re-open to varying degrees around the U.K we think it’s a good time
        to reboot Freegle. We know freegling will be immensely useful right now.
      </p>
      <p>
        We do not want to encourage unnecessary travel and we’d like everyone to stay safe so please
        <b>READ</b> and <b>FOLLOW</b> these updated COVID-19 guidelines for freegling.
      </p>
      <h4>Keep it ESSENTIAL</h4>
      <p>
        Initially we’d like to encourage OFFERs and WANTEDs for <b>essential</b> items only.  We know that will vary
        for different people and circumstances.  Please use your common sense &#x1F642;.  Many communities will have
        restrictions on what is and isn’t OK to freegle, so please respect this.
      </p>
      <h4>Keep it LOCAL</h4>
      <p>
        Please don’t travel further than you would be doing so anyway (to buy food, essentials or to go to work).
      </p>
      <p>
        Avoid special or extra journeys for freegling - see Government advice on
        <a href="https://www.gov.uk/government/publications/full-guidance-on-staying-at-home-and-away-from-others/full-guidance-on-staying-at-home-and-away-from-others" target="_blank" rel="noopener noreferrer">when you can leave the house</a>.
        Could you collect on foot or cycle while doing daily exercise?
      </p>
      <p>
        Only post to your nearest community - don’t post or reply if it’s further away.
      </p>
      <h4>PROTECT each other</h4>
      <p>
        Make sure anything you offer is clean.
      </p>
      <ul>
        <li>
          Wash fabric things.
        </li>
        <li>
          Wipe down hard surfaces with hot soapy water.
        </li>
      </ul>
      <p>
        Assume anything you collect <b>isn’t</b> clean (better safe than sorry).  Clean it yourself, and if possible
        leave it for a few days before touching it.
      </p>
      <p>
        Wear a face mask if you can when collecting, and wash your hands afterwards.
      </p>
      <h4>SOCIAL DISTANCING</h4>
      <p>
        Observe SOCIAL-DISTANCING and make CONTACT-LESS arrangements for collections.  Do not enter anyone else’s home
        or let them enter yours.  This might mean holding off listing bulky items that need a few people to move!
      </p>
      <h4>COVID-vulnerable?</h4>
      <p>
        As much as we’d like everyone to benefit from freegling, if you are COVID-vulnerable please do not freegle
        and exchange goods (though you’re welcome to ask for help with supplies via our
        <nuxt-link to="/chitchat">
          ChitChat
        </nuxt-link> section
      </p>
      <h4>And finally...</h4>
      <p>
        As always be kind, polite and don’t waste any	one’s time!
      </p>
      <p>
        Stay safe everyone!
      </p>
      <p>
        P.S. If you're super-happy we're back, any small donations would be super-helpful right now - thank you!
      </p>
      <DonationButton link="paypal1510" class="mt-2" />
    </b-modal>
  </NoticeMessage>
  <div v-else class="text-danger text-right clickme" @click="showit">
    Show COVID-19 warning.
  </div>
</template>
<script>
import NoticeMessage from './NoticeMessage'
import DonationButton from './DonationButton'

export default {
  components: { DonationButton, NoticeMessage },
  data: function() {
    return {
      showModal: false
    }
  },
  computed: {
    show() {
      return !this.$store.getters['misc/get']('hidecovidwarning')
    }
  },
  methods: {
    hideit() {
      this.$store.dispatch('misc/set', {
        key: 'hidecovidwarning',
        value: true
      })
    },
    showit() {
      this.$store.dispatch('misc/set', {
        key: 'hidecovidwarning',
        value: false
      })
    }
  }
}
</script>
