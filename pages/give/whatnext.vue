<template>
  <div>
    <div v-if="newuser">
      <NewUser :password="newpassword" />
    </div>
    <div v-else>
      <b-row class="m-0">
        <b-col cols="0" md="3" />
        <b-col cols="12" md="6">
          <h1 class="text-center">
            Thanks for freegling!
          </h1>
          <h5 class="text-center">
            We've put your offer here first:
          </h5>
          <groupHeader v-if="group" :key="'groupheader-' + group.id" :group="group" :show-join="false" />
          <p class="text-center mt-2">
            We'll let people know about your item, and contact you when people are interested via Chat (on here) and email
            (check your spam!)
          </p>
          <p class="text-center">
            You can promise your item to whoever you want, but we recommend waiting 24 hours before deciding.  This gives people
            who aren't online all the time a fair chance to reply.
          </p>
        </b-col>
      </b-row>
      <b-row class="text-center d-block d-md-none">
        <b-col cols="0" md="3" />
        <b-col cols="12" md="3" class="mt-2">
          <b-btn size="lg" variant="info" to="/give/whatisit">
            <v-icon name="gift" />&nbsp;Give something else
          </b-btn>
        </b-col>
        <b-col cols="12" md="3" class="mt-2">
          <b-btn variant="white" size="lg" @click="availability">
            <v-icon name="calendar-alt" /> Edit Availability
          </b-btn>
        </b-col>
        <b-col cols="12" md="3" class="mt-2">
          <b-btn size="lg" variant="primary" to="/find/search">
            <v-icon name="search" />&nbsp;Find something
          </b-btn>
        </b-col>
      </b-row>
      <b-row class="text-center d-none d-md-block">
        <b-col cols="12" md="6" offset-md="3" class="mt-2">
          <nuxt-link to="/give/whatisit" class="float-left">
            <b-btn size="lg" variant="info">
              <v-icon name="gift" />&nbsp;Give something else
            </b-btn>
          </nuxt-link>
          <b-btn variant="white" size="lg" @click="availability">
            <v-icon name="calendar-alt" /> Edit Availability
          </b-btn>
          <nuxt-link to="/find/search" class="float-right">
            <b-btn size="lg" variant="primary">
              <v-icon name="search" />&nbsp;Find something
            </b-btn>
          </nuxt-link>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="0" md="3" />
        <b-col cols="12" md="6" class="text-center mt-4">
          <nuxt-link to="/">
            <!-- TODO DESIGN MINOR This button is centred correctly w.r.t. the availability one above.  See also find/whatnext. -->
            <b-btn variant="white" size="lg">
              Continue to Home Page <v-icon name="angle-double-right" />
            </b-btn>
          </nuxt-link>
        </b-col>
      </b-row>
      <div class="d-none d-md-block">
        <b-tooltip :show.sync="show" target="menu-option-chat">
          Replies will appear here<br><br>

          You'll also get them by email.  <span class="text-danger font-weight-bold">Check your spam!</span>
        </b-tooltip>
      </div>
    </div>
    <AvailabilityModal v-if="me" ref="availabilitymodal" :thisuid="me.id" />
  </div>
</template>

<style lang="scss">
@import 'color-vars';

/*TODO DESIGN Make this prettier.  See also NewUser. */
.tooltip-inner {
  background-color: $color-white;
  color: $color-black;
  border: 1px $color-black solid;
}
.arrow {
  background-color: transparent;
  color: $color-white;
}
</style>

<script>
import { TooltipPlugin } from 'bootstrap-vue'
import Vue from 'vue'
import AvailabilityModal from '../../components/AvailabilityModal'
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
import 'vue-awesome/icons/search'
Vue.use(TooltipPlugin)

const GroupHeader = () => import('~/components/GroupHeader.vue')
const NewUser = () => import('~/components/NewUser.vue')

export default {
  components: {
    AvailabilityModal,
    GroupHeader,
    NewUser
  },
  mixins: [loginOptional, buildHead],
  data: function() {
    return {
      show: true,
      newuser: false,
      newpassword: null
    }
  },
  computed: {
    me() {
      return this.$store.getters['auth/user']
    },
    group() {
      const groupid = this.$store.getters['compose/getGroup']
      const group = this.$store.getters['group/get'](groupid)
      return group
    }
  },
  mounted: function() {
    // Fade out tooltip after a while
    setTimeout(() => (this.show = false), 10000)
    this.newuser = this.$route.params.newuser
    this.newpassword = this.$route.params.newpassword
  },
  methods: {
    availability() {
      this.$refs.availabilitymodal.show()
    }
  },

  head() {
    return this.buildHead('Success', 'Your OFFER has been posted')
  }
}
</script>
