<template>
  <div>
    <p>
      Freegle is particularly useful right now, but we do not want to encourage unnecessary travel and we'd like
      everyone to stay safe - So please
      <b>READ</b> and <b>FOLLOW</b> these updated COVID-19 guidelines for freegling.
    </p>
    <h4>Keep it LOCAL</h4>
    <p>
      Avoid special or extra journeys for freegling - see Government advice in
      <!-- eslint-disable-next-line -->
      <ExternalLink href="https://www.gov.uk/government/publications/staying-alert-and-safe-social-distancing/staying-alert-and-safe-social-distancing">England</ExternalLink>,
      <!-- eslint-disable-next-line -->
      <ExternalLink href="https://www.gov.uk/guidance/coronavirus-covid-19-information-for-individuals-and-businesses-in-scotland">Scotland</ExternalLink>,
      <ExternalLink href="https://gov.wales/coronavirus">
        Wales
      </ExternalLink>
      and
      <!-- eslint-disable-next-line -->
      <ExternalLink href="https://www.nidirect.gov.uk/campaigns/coronavirus-covid-19">Northern Ireland</ExternalLink>.
      Could you collect on foot or cycle while doing daily exercise?
    </p>
    <p>
      Where possible, please post to your nearest community and don't post or reply if it's further away.
    </p>
    <h4>PROTECT each other</h4>
    <p>
      If you have recently had COVID-19, please don't use Freegle for at least 10 days after you are free of symptoms.
    </p>
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
      Assume anything you collect <b>isn't</b> clean (better safe than sorry).  Clean it yourself, and if possible
      leave it for a few days before touching it.
    </p>
    <p>
      Wear a face mask if you can when collecting, and wash your hands afterwards.
    </p>
    <h4>SOCIAL DISTANCING</h4>
    <p>
      Observe SOCIAL-DISTANCING and make CONTACT-LESS arrangements for collections.  Do not enter anyone else's home
      or let them enter yours.  This might mean holding off listing bulky items that need a few people to move!
    </p>
    <h4>COVID-vulnerable?</h4>
    <p>
      As much as we'd like everyone to benefit from freegling, if you are COVID-vulnerable please do not freegle
      and exchange goods (though you're welcome to ask for help with supplies via our
      <nuxt-link to="/chitchat">
        ChitChat
      </nuxt-link> section).
    </p>
    <h4>And finally...</h4>
    <p>
      As always be kind, polite and don't waste anyone's time!
    </p>
    <p>
      Stay safe everyone!
    </p>
    <p>
      Small donations to help us help more people would be super-helpful right now - thank you!
    </p>
    <DonationButton link="paypal1510" class="mt-2" />
  </div>
</template>
<script>
import DonationButton from './DonationButton'
const ExternalLink = () => import('~/components/ExternalLink')
export default {
  components: { DonationButton, ExternalLink }
}
</script>
