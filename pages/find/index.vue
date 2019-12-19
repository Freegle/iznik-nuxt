<template>
  <b-col>
    <b-row class="m-0">
      <b-col cols="0" md="3" />
      <b-col cols="12" md="6">
        <h1 class="text-center">
          First, tell us where you are
        </h1>
        <p class="text-center">
          We'll use this to show you stuff nearby.  Don't worry, we won't give other people your postcode.
        </p>
        <b-row>
          <b-col class="text-center">
            <postcode class="justify-content-center" @selected="postcodeSelect" @cleared="postcodeClear" />
          </b-col>
        </b-row>
        <transition name="fade">
          <b-row v-if="postcode">
            <b-col class="text-center">
              <a v-if="extgroup" :href="extgroup">
                <v-icon name="check-circle" class="text-success mt-2 fa-bh" scale="5" />
              </a>
              <nuxt-link v-else to="/find/whatisit">
                <v-icon name="check-circle" class="text-success mt-2 fa-bh" scale="5" />
              </nuxt-link>
            </b-col>
          </b-row>
        </transition>
        <b-row v-if="postcode" class="mt-1">
          <b-col class="text-center">
            Freegle has local communities for each area. We'll put anything you post on here, and search this community and others nearby.
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
          <div v-if="extgroup">
            <notice-message variant="info" class="mt-1">
              This community is on a separate site. You can proceed or choose a different community using the dropdown
              above.
            </notice-message>
            <b-row class="mt-1">
              <b-col class="text-center mt-4" cols="6" offset="3">
                <b-btn variant="success" size="lg" block :href="extgroup">
                  Proceed <v-icon name="angle-double-right" />
                </b-btn>
              </b-col>
            </b-row>
          </div>
          <b-row v-else-if="postcode" class="mt-1">
            <b-col class="text-center mt-4" cols="6" offset="3">
              <nuxt-link to="/find/search" class="decornone">
                <b-btn variant="success" size="lg" block>
                  Next <v-icon name="angle-double-right" />
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
import NoticeMessage from '../../components/NoticeMessage'
import loginOptional from '@/mixins/loginOptional.js'
const Postcode = () => import('~/components/Postcode')
const ComposeGroup = () => import('~/components/ComposeGroup')

export default {
  components: {
    NoticeMessage,
    Postcode,
    ComposeGroup
  },
  mixins: [loginOptional],
  data() {
    return {
      id: null,
      postcode: null,
      source: process.env.API + '/locations?typeahead=',
      group: null
    }
  },
  computed: {
    extgroup() {
      if (
        this.postcode &&
        this.postcode.groupsnear &&
        this.postcode.groupsnear[0].external
      ) {
        return this.postcode.groupsnear[0].external
      }

      return null
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
      const groupid = this.$store.getters['compose/getGroup']

      if (pc && pc.groupsnear) {
        let found = false
        for (const group of pc.groupsnear) {
          if (parseInt(group.id) === parseInt(groupid)) {
            found = true
          }
        }

        let group

        if (!found) {
          group = pc.groupsnear[0].id
        } else {
          group = groupid
        }

        this.$store.dispatch('compose/setGroup', group)
      }
    },
    postcodeClear() {
      this.postcode = null
      this.group = null
      this.$store.dispatch('compose/setPostcode', null)
      this.$store.dispatch('compose/setGroup', null)
    }
  }
}
</script>
