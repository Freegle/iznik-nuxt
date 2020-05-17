<template>
  <div>
    <p>
      As tips and recycling centres start to re-open to varying degrees around the UK, we think it's a good time
      to reboot Freegle. We know freegling will be immensely useful right now, and
      <a href="https://www.gov.uk/government/publications/coronavirus-covid-19-advice-to-local-authorities-on-prioritising-waste-collections/managing-household-waste-and-recycling-centres-hwrcs-in-england-during-the-coronavirus-covid-19-pandemic#annex---communications-to-residents">government advice</a> is to
      use online platforms such as ours rather than go to tips or recycling centres.
    </p>
    <p>
      We do not want to encourage unnecessary travel and we'd like everyone to stay safe - so please
      <b>READ</b> and <b>FOLLOW</b> these updated COVID-19 guidelines for freegling.
    </p>
    <h4>Keep it ESSENTIAL</h4>
    <p>
      Initially we'd like to encourage OFFERs and WANTEDs for <b>essential</b> items only.  We know that will vary
      for different people and circumstances.  Please use your common sense &#x1F642;.  Many communities will have
      restrictions on what is and isn't OK to freegle.  Some communities may still be closed based on
      local conditions.  If your local volunteers say this, please respect it - we're just trying to keep you safe.
    </p>
    <h4>Keep it LOCAL</h4>
    <p>
      Avoid special or extra journeys for freegling - see Government advice in
      <ExternalLink href="https://www.gov.uk/government/publications/full-guidance-on-staying-at-home-and-away-from-others/full-guidance-on-staying-at-home-and-away-from-others">
        England,
      </ExternalLink>
      <ExternalLink href="https://www.gov.uk/guidance/coronavirus-covid-19-information-for-individuals-and-businesses-in-scotland">
        Scotland,
      </ExternalLink>
      <ExternalLink href="https://gov.wales/coronavirus">
        Wales
      </ExternalLink>
      and
      <ExternalLink href="https://www.nidirect.gov.uk/campaigns/coronavirus-covid-19">
        Northern Ireland.
      </ExternalLink>
      Could you collect on foot or cycle while doing daily exercise?
    </p>
    <p>
      Only post to your nearest community - please don't post or reply if it's further away.
    </p>
    <h4>PROTECT each other</h4>
    <p>
      If you have recently had COVID-19, please don't use Freegle for at least 7 days after you are free of symptoms.
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
      P.S. If you're happy we're back, any small donations would be super-helpful right now - thank you!
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
