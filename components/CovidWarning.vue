<template>
  <NoticeMessage v-if="show" variant="danger">
    <!--    <b-btn variant="link" class="float-right" @click="hideit">-->
    <!--      Hide this-->
    <!--    </b-btn>-->
    <p>
      Tips and recycling centres are re-opening, but the
      <a rel="noopener noreferrer" target="_blank" href="https://www.gov.uk/government/publications/coronavirus-covid-19-advice-to-local-authorities-on-prioritising-waste-collections/managing-household-waste-and-recycling-centres-hwrcs-in-england-during-the-coronavirus-covid-19-pandemic#annex---communications-to-residents">government advice</a>
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
  <div v-else class="text-danger text-right clickme" @click="showit">
    Show COVID-19 warning.
  </div>
</template>
<script>
import NoticeMessage from './NoticeMessage'
import CovidSafeFreegling from './CovidSafeFreegling'

export default {
  components: { CovidSafeFreegling, NoticeMessage },
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
