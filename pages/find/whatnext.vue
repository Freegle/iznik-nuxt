<template>
  <div v-if="newuser">
    <NewUser :password="newpassword" />
  </div>
  <div v-else>
    <b-row class="m-0">
      <b-col cols="12" lg="6" offset-lg="3">
        <h1 class="text-center">
          That's it!
        </h1>
        <h5 class="text-center">
          We've put your request on:
        </h5>
        <groupHeader v-if="group" :key="'groupheader-' + group.id" :group="group" :show-join="false" />
        <p class="text-center mt-2">
          We'll let people know that you're looking for this, and contact you when people are interested via Chat (on here) and email
          (check your spam!)
        </p>
      </b-col>
    </b-row>
    <div class="text-center">
      <div class="mt-2">
        <b-btn size="lg" variant="primary" to="/find/whatisit">
          <v-icon name="shopping-cart" />&nbsp;Find something else
        </b-btn>
      </div>
      <div class="mt-2">
        <b-btn size="lg" variant="secondary" to="/give/whatisit">
          <v-icon name="gift" />&nbsp;Give something
        </b-btn>
      </div>
      <div class="mt-2">
        <b-btn variant="white" size="lg" @click="availability">
          <v-icon name="calendar-alt" /> Edit Availability
        </b-btn>
      </div>
    </div>
    <div class="text-center mt-4">
      <nuxt-link to="/">
        <b-btn variant="white" size="lg">
          Continue to Home Page <v-icon name="angle-double-right" />
        </b-btn>
      </nuxt-link>
    </div>

    <b-tooltip :show.sync="show" target="menu-option-chat" class="d-none d-md-block">
      Replies will appear here<br><br>

      You'll also get them by email.  <span class="text-danger font-weight-bold">Check your spam!</span>
    </b-tooltip>
    <AvailabilityModal v-if="me" ref="availabilitymodal" :thisuid="me.id" />
    <ShareModal :id="lastSubmitted" ref="share" maybe />
  </div>
</template>

<style lang="scss">
@import 'color-vars';

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
import ShareModal from '../../components/ShareModal'
import waitForRef from '../../mixins/waitForRef'
import loginOptional from '@/mixins/loginOptional.js'
import buildHead from '@/mixins/buildHead.js'
Vue.use(TooltipPlugin)

const GroupHeader = () => import('~/components/GroupHeader.vue')
const NewUser = () => import('~/components/NewUser.vue')

export default {
  components: {
    ShareModal,
    AvailabilityModal,
    GroupHeader,
    NewUser
  },
  mixins: [loginOptional, buildHead, waitForRef],
  data: function() {
    return {
      show: true,
      newuser: false,
      newpassword: null
    }
  },
  computed: {
    group() {
      const groupid = this.$store.getters['compose/getGroup']
      const group = this.$store.getters['group/get'](groupid)
      return group
    },
    lastSubmitted() {
      return this.$store.getters['compose/lastSubmitted']
    }
  },
  mounted: function() {
    // Fade out tooltip after a while
    setTimeout(() => (this.show = false), 10000)
    this.newuser = this.$route.params.newuser
    this.newpassword = this.$route.params.newpassword

    if (this.lastSubmitted) {
      this.waitForRef('share', () => {
        this.$refs.share.show()
      })
    }
  },
  methods: {
    availability() {
      this.$refs.availabilitymodal.show()
    }
  },

  head() {
    return this.buildHead('Success', 'Your WANTED has been posted')
  }
}
</script>
