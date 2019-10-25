<template>
  <div v-if="newuser">
    <NewUser :password="newpassword" />
  </div>
  <div v-else>
    <b-row class="m-0">
      <b-col cols="0" md="3" />
      <b-col cols="12" md="6">
        <h1 class="text-center">
          That's it!
        </h1>
        <h5 class="text-center">
          We've put your request on:
        </h5>
        <groupHeader v-if="group" :key="'groupheader-' + group.id" v-bind="group" show-join="false" />
        <p class="text-center mt-2">
          We'll let people know that you're looking for this, and contact you when people are interested via Chat (on here) and email
          (check your spam!)
        </p>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="0" md="3" />
      <b-col cols="12" md="6" class="mt-2">
        <nuxt-link to="/give" class="float-left">
          <b-btn size="lg" variant="info">
            <v-icon name="gift" />&nbsp;Give something else
          </b-btn>
        </nuxt-link>
        <nuxt-link to="/find/search" class="float-right">
          <b-btn size="lg" variant="primary">
            <v-icon name="search" />&nbsp;Find something
          </b-btn>
        </nuxt-link>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="text-center mt-2">
        <nuxt-link to="/">
          <b-btn variant="white">
            Continue to Home Page <v-icon name="angle-double-right" />
          </b-btn>
        </nuxt-link>
      </b-col>
    </b-row>
    <b-tooltip :show.sync="show" target="menu-option-chat" class="d-none d-md-block">
      Replies will appear here<br><br>

      You'll also get them by email.  <span class="text-danger font-weight-bold">Check your spam!</span>
    </b-tooltip>
  </div>
</template>

<style lang="scss">
@import 'color-vars';

/*TODO Make this prettier*/
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
// TODO Popups appear in weird places, Chris says - moves down to bottom left.
import loginOptional from '@/mixins/loginOptional.js'
const GroupHeader = () => import('~/components/GroupHeader.vue')
const NewUser = () => import('~/components/NewUser.vue')

export default {
  components: {
    GroupHeader,
    NewUser
  },
  mixins: [loginOptional],
  data: function() {
    return {
      show: true,
      newuser: false,
      newpassword: null
    }
  },
  computed: {
    group() {
      const groupid = this.$store.getters['compose/getGroup']()
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
  methods: {}
}
</script>
