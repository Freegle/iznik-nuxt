<template>
  <NoticeMessage variant="danger">
    <p>
      Tips and recycling centres are re-opening, but the
      <ExternalLink href="https://www.gov.uk/government/publications/coronavirus-covid-19-advice-to-local-authorities-on-prioritising-waste-collections/managing-household-waste-and-recycling-centres-hwrcs-in-england-during-the-coronavirus-covid-19-pandemic#annex---communications-to-residents">
        government advice
      </ExternalLink>
      encourages you to use online platforms such as ours instead.  Most Freegle communities are now open - some
      may have restrictions or remain closed based on the local situation.
    </p>
    <p>
      We hope you and yours are safe.  Please freegle responsibly and help keep it that way.
    </p>
    <b-btn variant="primary" @click="showModal = true">
      Read our advice on safe freegling
    </b-btn>
    <b-modal v-model="showModal" ok-only size="lg" title="Safe Freegling" ok-title="Close">
      <CovidSafeFreegling />
    </b-modal>
  </NoticeMessage>
</template>
<script>
import NoticeMessage from './NoticeMessage'
import CovidSafeFreegling from './CovidSafeFreegling'
const ExternalLink = () => import('~/components/ExternalLink')

export default {
  components: { CovidSafeFreegling, NoticeMessage, ExternalLink },
  data: function() {
    return {
      showModal: false
    }
  }
}
</script>
