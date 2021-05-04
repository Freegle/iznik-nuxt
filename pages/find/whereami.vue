<template>
  <b-row class="m-0">
    <b-col cols="0" md="3" />
    <b-col cols="12" lg="6" class="p-0">
      <CovidWarning />
      <client-only>
        <WizardProgress :active-stage="2" class="d-none d-md-flex" />
      </client-only>
      <h1 class="text-center">
        Now, tell us where you are
      </h1>
      <p class="text-center">
        We'll use this to show your wanted to people nearby.  Don't worry, we won't give other people your postcode.
      </p>
      <client-only>
        <b-row>
          <b-col class="text-center">
            <postcode class="justify-content-center" :value="initialPostcode" @selected="postcodeSelect" @cleared="postcodeClear" />
          </b-col>
        </b-row>
        <b-row v-if="postcodeValid && !closed">
          <b-col class="text-center">
            <transition name="fade">
              <a v-if="extgroup" :href="extgroup">
                <v-icon name="check-circle" class="text-success mt-2 fa-bh" scale="5" />
              </a>
              <nuxt-link v-else to="/find">
                <v-icon name="check-circle" class="text-success mt-2 fa-bh" scale="5" />
              </nuxt-link>
            </transition>
          </b-col>
        </b-row>
        <b-row v-if="postcodeValid && !closed" class="mt-1">
          <b-col class="text-center">
            Freegle has local communities for each area. We'll put anything you post on here, and search this community and others nearby.
          </b-col>
        </b-row>
        <b-row v-if="postcodeValid" class="mt-1">
          <b-col class="text-center">
            <ComposeGroup />
          </b-col>
        </b-row>
        <b-row v-if="postcodeValid && !closed" class="mt-1">
          <b-col class="text-center text-muted small">
            Click on the name above to choose a different community.
          </b-col>
        </b-row>
        <CovidClosed v-if="closed" class="mt-2" />
        <div v-else-if="extgroup">
          <transition name="fade">
            <notice-message variant="info" class="mt-1">
              This community is on a separate site. You can proceed or choose a different community using the dropdown
              above.
            </notice-message>
            <b-row class="mt-1">
              <b-col class="text-center mt-4" cols="12" md="6" offset-md="3">
                <b-btn variant="primary" size="lg" block :href="extgroup">
                  Proceed <v-icon name="angle-double-right" />
                </b-btn>
              </b-col>
            </b-row>
          </transition>
        </div>
        <div class="mt-1 d-block d-md-none">
          <b-btn
            variant="primary"
            size="lg"
            block
            to="/find/whoami"
          >
            Next <v-icon name="angle-double-right" />
          </b-btn>
        </div>
        <div class="mt-1 d-none d-md-flex justify-content-between">
          <b-btn variant="secondary" size="lg" to="/find">
            <v-icon name="angle-double-left" /> Back
          </b-btn>
          <b-btn v-if="postcodeValid && !closed" variant="primary" size="lg" to="/find/whoami">
            Next <v-icon name="angle-double-right" />
          </b-btn>
        </div>
      </client-only>
    </b-col>
    <b-col cols="0" md="3" />
  </b-row>
</template>
<style scoped>
select {
  max-width: 400px !important;
}
</style>
<script>
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
import compose from '@/mixins/compose.js'
import WizardProgress from '@/components/WizardProgress'
import NoticeMessage from '../../components/NoticeMessage'
import CovidClosed from '../../components/CovidClosed'
import CovidWarning from '~/components/CovidWarning'
import Postcode from '~/components/Postcode'
const ComposeGroup = () => import('~/components/ComposeGroup')

export default {
  components: {
    WizardProgress,
    CovidWarning,
    CovidClosed,
    NoticeMessage,
    Postcode,
    ComposeGroup
  },
  mixins: [loginOptional, buildHead, compose],
  data() {
    return {
      id: null,
      source: process.env.API + '/locations?typeahead='
    }
  },
  head() {
    return this.buildHead(
      'Find something',
      'See what people nearby are giving away for free'
    )
  }
}
</script>
