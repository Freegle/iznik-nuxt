<template>
  <b-col>
    <b-row class="m-0">
      <b-col cols="12" lg="6" offset-lg="3">
        <WizardProgress :active-stage="1" class="d-none " />
        <CovidWarning class="mt-2" />
        <h1 class="text-center">
          First, tell us where you are
        </h1>
        <p class="text-center">
          We'll use this to show your offer to people nearby.  Don't worry, we won't give other people your postcode.
        </p>
        <b-row>
          <b-col class="text-center">
            <postcode class="justify-content-center" @selected="postcodeSelect" @cleared="postcodeClear" />
          </b-col>
        </b-row>
        <transition v-if="!closed" name="fade">
          <b-row v-if="postcode">
            <b-col class="text-center">
              <a v-if="extgroup" :href="extgroup">
                <v-icon name="check-circle" class="text-success mt-2 fa-bh" scale="5" />
              </a>
              <nuxt-link v-else to="/give/whatisit">
                <v-icon name="check-circle" class="text-success mt-2 fa-bh" scale="5" />
              </nuxt-link>
            </b-col>
          </b-row>
        </transition>
        <transition v-if="closed" name="fade">
          <CovidClosed class="mt-2" />
        </transition>
        <div v-else-if="!extgroup">
          <b-row v-if="postcode" class="mt-1">
            <b-col class="text-center">
              Freegle has local communities for each area.  We'll show your offer on this community first:
            </b-col>
          </b-row>
          <b-row v-if="postcode" class="mt-1">
            <b-col class="text-center">
              <ComposeGroup />
            </b-col>
          </b-row>
          <b-row v-if="postcode" class="mt-1">
            <b-col class="text-center text-muted">
              Click on the name above to choose a different community.
            </b-col>
          </b-row>
        </div>
        <transition v-if="!closed" name="fade">
          <div v-if="extgroup">
            <notice-message variant="info" class="mt-1">
              This community is on a separate site. You can proceed or choose a different community using the dropdown
              above.
            </notice-message>
            <b-row class="mt-1">
              <b-col class="text-center mt-4" cols="12" md="6" offset-md="3">
                <b-btn variant="success" size="lg" block :href="extgroup">
                  Proceed <v-icon name="angle-double-right" />
                </b-btn>
              </b-col>
            </b-row>
          </div>
          <b-row v-else-if="postcode" class="mt-1">
            <b-col class="text-center mt-4" cols="12" md="6" offset-md="3">
              <b-btn variant="success" size="lg" block to="/give/whatisit">
                Next <v-icon name="angle-double-right" />
              </b-btn>
            </b-col>
          </b-row>
        </transition>
      </b-col>
      <b-col cols="0" md="3" />
    </b-row>
  </b-col>
</template>

<style scoped>
select {
  max-width: 400px !important;
}
</style>

<script>
import NoticeMessage from '../../components/NoticeMessage'
import CovidWarning from '../../components/CovidWarning'
import CovidClosed from '../../components/CovidClosed'
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
import compose from '@/mixins/compose.js'

const Postcode = () => import('~/components/Postcode')
const ComposeGroup = () => import('~/components/ComposeGroup')
const WizardProgress = () => import('~/components/WizardProgress')

export default {
  options: () => {},
  components: {
    CovidClosed,
    CovidWarning,
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
