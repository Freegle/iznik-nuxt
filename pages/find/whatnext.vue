<template>
  <div>
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
            Continue to Home Page >>
          </b-btn>
        </nuxt-link>
      </b-col>
    </b-row>
    <b-tooltip :show.sync="show" target="menu-option-chat">
      Replies will appear here<br><br>

      You'll also get them by email.  <span class="text-danger font-weight-bold">Check your spam!</span>
    </b-tooltip>
  </div>
</template>
<style>
/*TODO Make this prettier*/
.tooltip-inner {
  background-color: white;
  color: black;
  border: 1px black solid;
}
.arrow {
  background-color: transparent;
  color: white;
}
</style>
<script>
import loginOptional from '@/mixins/loginOptional.js'
const GroupHeader = () => import('~/components/GroupHeader.vue')

export default {
  components: {
    GroupHeader
  },
  mixins: [loginOptional],
  data: function() {
    return {
      show: true
    }
  },
  computed: {
    group() {
      const groupid = this.$store.getters['compose/getGroup']()
      console.log('Got group', groupid)
      const group = this.$store.getters['group/get'](groupid)
      console.log('Gives group', group)
      return group
    }
  },
  mounted: function() {
    // Fade out tooltip after a while
    setTimeout(() => (this.show = false), 10000)
  },
  methods: {}
}
</script>
