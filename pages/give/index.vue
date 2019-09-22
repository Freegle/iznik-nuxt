<template>
  <b-col>
    <b-row class="m-0">
      <b-col cols="0" md="3" />
      <b-col cols="12" md="6">
        <b-row class="bs-wizard">
          <b-col cols="4" class="bs-wizard-step">
            <div class="text-center bs-wizard-stepnum active">
              &nbsp;
            </div>
            <div class="progress">
              <div class="progress-bar" />
            </div>
            <a href="#" class="bs-wizard-dot active" />
            <div class="bs-wizard-info text-center">
              Where are you?
            </div>
          </b-col>
          <b-col cols="4" class="bs-wizard-step">
            <div class="text-center bs-wizard-stepnum">
              &nbsp;
            </div>
            <div class="progress">
              <div class="progress-bar" />
            </div>
            <a href="#" class="bs-wizard-dot" />
            <div class="bs-wizard-info text-center">
              What is it?
            </div>
          </b-col>
          <b-col cols="4" class="bs-wizard-step">
            <div class="text-center bs-wizard-stepnum">
              &nbsp;
            </div>
            <div class="progress">
              <div class="progress-bar" />
            </div>
            <a href="#" class="bs-wizard-dot" />
            <div class="bs-wizard-info text-center">
              Who are you?
            </div>
          </b-col>
        </b-row>

        <h1 class="text-center">
          First, tell us where you are
        </h1>
        <p class="text-center">
          We'll use this to show your offer to people nearby.  Don't worry, we won't give other people your postcode.
        </p>
        <b-row>
          <b-col class="text-center">
            <postcode @selected="postcodeSelect" @cleared="postcodeClear" />
          </b-col>
        </b-row>
        <transition name="fade">
          <b-row v-if="postcode">
            <b-col class="text-center">
              <nuxt-link to="/give/whatisit">
                <v-icon name="check-circle" class="text-success mt-2 fa-bh" scale="5" />
              </nuxt-link>
            </b-col>
          </b-row>
        </transition>
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
        <transition name="fade">
          <b-row v-if="postcode" class="mt-1">
            <b-col class="text-center mt-4" cols="6" offset="3">
              <nuxt-link to="/give/whatisit" class="decornone">
                <b-btn variant="success" size="lg" block>
                  Next >>
                </b-btn>
              </nuxt-link>
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
// TODO Norfolk and redirection to another site?
import loginOptional from '@/mixins/loginOptional.js'
const Postcode = () => import('~/components/Postcode')
const ComposeGroup = () => import('~/components/ComposeGroup')

export default {
  options: () => {},
  components: {
    Postcode,
    ComposeGroup
  },
  mixins: [loginOptional],
  props: {},
  data() {
    return {
      id: null,
      postcode: null,
      source: process.env.API + '/locations?typeahead='
    }
  },
  async asyncData({ app, params, store }) {},
  methods: {
    getLocation() {},
    postcodeSelect(pc) {
      this.postcode = pc
      this.$store.dispatch('compose/setPostcode', this.postcode)

      // If we don't have a group currently which is in the list near this postcode, choose the closest.  That
      // allows people to select further away groups if they wish.
      const groupid = this.$store.getters['compose/getGroup']()

      if (pc && pc.groupsnear) {
        let found = false
        for (const group of pc.groupsnear) {
          if (parseInt(group.id) === parseInt(groupid)) {
            found = true
          }
        }

        if (!found) {
          this.group = pc.groupsnear[0].id
        } else {
          this.group = groupid
        }

        this.$store.dispatch('compose/setGroup', this.group)
      }
    },
    postcodeClear() {
      this.postcode = null
      this.$store.dispatch('compose/setPostcode', null)
      this.$store.dispatch('compose/setGroup', null)
    }
  }
}
</script>
