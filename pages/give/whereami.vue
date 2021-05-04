<template>
  <b-row class="m-0">
    <b-col cols="12" lg="6" offset-lg="3" class="p-0">
      <CovidWarning />
      <client-only>
        <WizardProgress :active-stage="2" class="d-none d-md-flex" />
      </client-only>
      <h1 class="text-center">
        Now, tell us where you are
      </h1>
      <p class="text-center">
        We'll use this to show your offer to people nearby.  Don't worry, we won't give other people your postcode.
      </p>
      <client-only>
        <b-row>
          <b-col class="text-center">
            <postcode class="justify-content-center" :value="initialPostcode" @selected="postcodeSelect" @cleared="postcodeClear" />
          </b-col>
        </b-row>
        <b-row v-if="!closed && postcodeValid">
          <b-col class="text-center">
            <transition name="fade">
              <nuxt-link to="/give/whoami">
                <v-icon name="check-circle" class="text-success mt-2 fa-bh" scale="5" />
              </nuxt-link>
            </transition>
          </b-col>
        </b-row>
        <CovidClosed v-if="closed" class="mt-2" />
        <div v-else-if="noGroups">
          <NoticeMessage variant="info">
            We're really sorry, but there are no communities near there.  If you'd like to start one, please
            <ExternalLink href="mailto:newgroups@ilovefreegle.org">
              get in touch!
            </ExternalLink>
          </NoticeMessage>
        </div>
        <div v-else>
          <b-row v-if="postcodeValid" class="mt-1">
            <b-col class="text-center">
              Freegle has local communities for each area.  We'll show your offer on this community first:
            </b-col>
          </b-row>
          <b-row v-if="postcodeValid" class="mt-1">
            <b-col class="text-center">
              <ComposeGroup />
            </b-col>
          </b-row>
          <b-row v-if="postcodeValid" class="mt-1">
            <b-col class="text-center text-muted small">
              Click on the name above to choose a different community.
            </b-col>
          </b-row>
        </div>
        <div class="mt-1 d-block d-md-none">
          <b-btn
            variant="primary"
            size="lg"
            block
            to="/give/whoami"
          >
            Next <v-icon name="angle-double-right" />
          </b-btn>
        </div>
        <div class="mt-1 d-none d-md-flex justify-content-between">
          <b-btn variant="secondary" size="lg" to="/give" class="d-none d-md-block">
            <v-icon name="angle-double-left" /> Back
          </b-btn>
          <b-btn v-if="postcodeValid && !closed" variant="primary" size="lg" to="/give/whoami">
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
import ExternalLink from '@/components/ExternalLink'
import NoticeMessage from '../../components/NoticeMessage'
import CovidClosed from '../../components/CovidClosed'
import CovidWarning from '~/components/CovidWarning'
import Postcode from '~/components/Postcode'

const ComposeGroup = () => import('~/components/ComposeGroup')
const WizardProgress = () => import('~/components/WizardProgress')

export default {
  options: () => {},
  components: {
    ExternalLink,
    CovidWarning,
    CovidClosed,
    NoticeMessage,
    Postcode,
    ComposeGroup,
    WizardProgress
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
      'Give something',
      'OFFER something to people nearby and see who wants it'
    )
  }
}
</script>
